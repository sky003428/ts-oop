import Net from "net";
import Db from "../modules/db";

export default class Player {
    public totalDamage: number = 0;
    public attacktime: number = 0;
    public maxDamage: number = 10;
    public socket: Net.Socket;
    public overSended: boolean = false;

    constructor(public id: number, public name: string, public feather: boolean, public title: string[]) {
        id = this.id;
        name = this.name;
    }

    public attack(monsterHp: number): number {
        let dmg: number = Math.ceil(Math.random() * this.maxDamage) + 5;
        if (dmg > monsterHp) {
            dmg = monsterHp;
        }

        this.totalDamage += dmg;
        ++this.attacktime;
        return dmg;
    }

    public initialFightLog(): void {
        this.totalDamage = 0;
        this.attacktime = 0;
    }

    public getFeather(): void {
        this.feather = true;
        this.update().catch((err) => {
            console.log(err);
        });
    }

    public async update(): Promise<void> {
        return new Promise((res, rej) => {
            Db.query("UPDATE `player` SET `feather` = ? WHERE id = ?", [this.feather, this.id], (err, okPacket) => {
                if (err) {
                    return rej("Error: Player update error\r\n" + err);
                }
                res();
            });
        });
    }
}
