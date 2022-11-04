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
    static respawn(): Promise<void> {
        return new Promise((res, rej): void => {
            db.query("INSERT INTO monster (name, hp) VALUES (?, ?)", ["鳳凰", 10000], (err) => {
                if (err) {
                    return rej(err);
                }

                console.log("phoenix reborn!!");
                res();
            });
        });
    }

    public init(): Promise<M> {
        return new Promise((res, rej): void => {
            db.query(
                "SELECT * FROM monster WHERE name = ? ORDER BY born_at DESC LIMIT 1",
                this.name,
                (err, row): void => {
                    if (err) {
                        return rej(err);
                    }

                    res(row[0]);
                }
            );
        });
    }

    public getData(): M {
        return this.data;
    }

    public setData(data: M): void {
        this.data = data;
    }

    public beAttack(dmg: number): void {
        this.data.hp -= dmg;
    }

    public monsterDie(playerName: string): Promise<void> {
        return new Promise((res, rej) => {
            this.data.ks = playerName;
            db.query(
                "UPDATE monster SET hp = ?, ks = ? WHERE id = ?;",
                [this.data.hp, playerName, this.data.id],
                (err): void => {
                    if (err) {
                        return rej(err);
                    }
                    res();
                }
            );
        });
    }
}
