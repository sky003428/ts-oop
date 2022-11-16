import Net from "net";
import { env } from "process";

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

    public static fetch(master: Net.Socket, name: string): void {
        master.write(JSON.stringify({ type: "fetch", body: "", name, target: "monster" }));
    }

    public getData(): M {
        return this.data;
    }

    public setData(data: M): void {
        this.data = data;
    }

    public beAttack(dmg: number): void {
        this.data.hp -= dmg;
        console.log(this.data.hp);
    }

    // public monsterDie(playerName: string): Promise<void> {
    //     console.log("Phoenix was killed by:", playerName);

    //     this.data.ks = playerName;
    // }
}
