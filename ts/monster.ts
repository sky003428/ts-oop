import Db from "./db";

export interface M {
    id: number;
    name: string;
    hp: number;
    ks: string;
    bornAt?: number;
}

export class Monster {
    private data: M;

    constructor(private name: string) {
        this.name = name;
    }

    public async init(): Promise<M> {
        return new Promise((res, rej): void => {
            Db.query(
                "SELECT * FROM monster WHERE name = ? AND hp > 0 ORDER BY born_at DESC LIMIT 1",
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

    public respawn(): Promise<void> {
        return new Promise((res, rej): void => {
            Db.query("INSERT INTO monster (name, hp) VALUES (?, ?)", [this.name, 10000], (err, row) => {
                if (err) {
                    return rej(err);
                }

                console.log("Phoenix respawn!!");
                this.data = { id: row.insertId, name: this.name, hp: 10000, ks: "" };
                res();
            });
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
        console.log("Phoenix was killed by:", playerName);

        this.data.ks = playerName;
        return new Promise((res, rej) => {
            Db.query(
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
