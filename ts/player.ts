import Net from "net";
import db from "./db";

export interface P {
    id: number;
    name: string;
    feather: boolean;
    title: string[];
}

export class Player {
    public totalDamage: number = 0;
    public attackTimes: number = 0;
    private maxDamage: number = 5;

    constructor(
        public readonly id: number,
        public readonly name: string,
        public feather: boolean,
        public title: string[],
        public socket: Net.Socket
    ) {
        this.id = id;
        this.name = name;
        this.feather = feather;
        this.title = title;
        this.socket = socket;
    }

    public static getPlayerByName(name: string): Promise<P> {
        return new Promise((res, rej): void => {
            db.query("SELECT * FROM player WHERE name = ?", name, (err, row) => {
                if (err) {
                    return rej(err);
                }
                if (row[0]) {
                    row[0].title = JSON.parse(row[0].title);
                    res(JSON.parse(JSON.stringify(row[0])));
                } else {
                    res(undefined);
                }
            });
        });
    }

    public static createPlayerByName(name: string): Promise<P> {
        return new Promise((res, rej): void => {
            db.query("INSERT INTO `player` (`name`) VALUES (?)", name, (err, row) => {
                if (err) {
                    return rej(err);
                }
                res({ id: row.insertId, name, feather: false, title: [] });
            });
        });
    }

    public attack(monsterHp: number): number {
        let dmg: number = Math.ceil(Math.random() * this.maxDamage);

        if (monsterHp - dmg < 0) {
            dmg = monsterHp;
        }
        ++this.attackTimes;
        this.totalDamage += dmg;
        return dmg;
    }

    public updateFeather(): Promise<string> {
        this.feather = true;
        return new Promise((res, rej): void => {
            db.query("UPDATE player SET feather = 1 WHERE id = ?", this.id, (err, row) => {
                if (err) {
                    return rej(err);
                }
                res("st");
            });
        });
    }

    public isOver(): boolean {
        return this.feather || this.title.includes("勇者");
    }

    public initAttackLog(): void {
        this.totalDamage = 0;
        this.attackTimes = 0;
    }
}
