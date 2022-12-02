import Net from "net";
import { Packer } from "../modules/packet_processor";
import RpcType from "../modules/rpc_type";

export default class Monster {
    public static socket: Net.Socket;
    private data: M = { id: 0, name: "鳳凰", hp: 0, ks: "" };
    private isRespawn: boolean = false;
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public beAttack(dmg: number, name: string): void {
        // this.data.hp -= dmg;
        const c: Content = { type: RpcType.BeAttack, body: dmg.toString(), target: "monster", name };
        Monster.socket.write(Packer(c));
    }

    public getData() {
        return this.data;
    }

    public setData(data: M): boolean {
        const isRespawnSnap: boolean = this.isRespawn;
        this.isRespawn = true;

        this.data = data;
        return isRespawnSnap;
    }
}
