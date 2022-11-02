import db from "./db";

export interface M {
    id: number;
    name: string;
    hp: number;
    ks: string;
    bornAt: number;
}

export class Monster {
    private readonly name: string;
    private data: M;

    constructor(name: string) {
        this.name = name;
    }
    static reborn(): void {
        db.query("INSERT INTO monster (name, hp) VALUES (?, ?)", ["鳳凰", 10000], (err) => {
            if (err) {
                throw err;
            }
            console.log("鳳凰已經重生");
        });
    }

    async init(): Promise<void> {
        return new Promise((res, rej): void => {
            const sql = "SELECT * FROM monster WHERE name = ? ORDER BY born_at DESC LIMIT 1";
            db.query(sql, this.name, (err, [row]): void => {
                if (err) {
                    throw err;
                }

                this.data = row;
                res();
            });
        });
    }

    getData(): M | undefined {
        return this.data;
    }

    beAttack(dmg: number, playerName: string): void {
        this.data.hp -= dmg;
        if (this.data.hp <= 0) {
            this.data.ks = playerName;
            
            db.query(
                "UPDATE monster SET hp = ?, ks = ? WHERE id = ?;",
                [this.data.hp, playerName, this.data.id],
                (err: Error): void => {
                    if (err) {
                        throw err;
                    }
                }
            );
        }
    }
}
