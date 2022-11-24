import Net from "net";
import { Packer } from "../modules/packet_processor";

export default class Monster {
    public static socket: Net.Socket;
    public data: M = { id: 0, name: "鳳凰", hp: 0, ks: "" };
    public isRespawn: boolean = false;

    constructor(public name: string) {
        this.name = name;
    }

    public beAttack(dmg: number): void {
        this.data.hp -= dmg;
    }

    public setData(data: M): boolean {
        const isRespawnSnap: boolean = this.isRespawn;
        this.isRespawn = true;

        this.data = data;
        return isRespawnSnap;
    }

    public monsterKilledBy(ksPlayer: string): void {
        console.log(`<Phoenix> has died, kill by ${ksPlayer}`);
        this.data.ks = ksPlayer;

        const die: Content = { type: "die", body: JSON.stringify(this.data), target: "monster", name: "3001" };
        console.log("send:", die);
        Monster.socket.write(Packer(die));
    }

    public static create(monsterName: string, delay: number = 15): void {
        setTimeout(() => {
            const create: Content = { type: "create", body: monsterName, target: "monster", name: "3001" };
            console.log("send:", create);
            Monster.socket.write(Packer(create));
        }, 1000 * delay);
    }
}