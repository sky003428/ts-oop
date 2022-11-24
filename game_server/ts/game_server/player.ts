import Net from "net";
import Db from "../modules/db";

export default class Player {
    public id: number;
    public name: string;
    public feather: boolean;
    public title: string[];

    public socket: Net.Socket;
    public overSended: boolean = false;
    private totalDamage: number = 0;
    private attacktime: number = 0;
    private maxDamage: number = 10;

    constructor(id: number, name: string, feather: boolean, title: string[]) {
        this.id = id;
        this.name = name;
        this.feather = feather;
        this.title = title;
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

    public getAttackLog() {
        return { total: this.totalDamage, time: this.attacktime };
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
