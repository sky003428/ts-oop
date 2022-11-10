import db from "./db";
import { R } from "./game";

export interface P {
    id: number;
    name: string;
    feather: boolean;
    title: string[];
}

export class Player {
    public readonly id: number;
    public readonly name: string;
    public feather: boolean;
    public title: string[];
    public totalDamage: number = 0;
    public attackTimes: number = 0;
    

    constructor(id: number, name: string, feather: boolean, title: string[]) {
        this.id = id;
        this.name = name;
        this.feather = feather;
        this.title = title;
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

    public attack(): number {
        const dmg: number = Math.ceil(Math.random() * 9);
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

    public isGameOver(): boolean {
        return this.feather || this.title.includes("勇者");
    }
}
