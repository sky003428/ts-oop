import Db from "./modules/db";
import { Packer } from "./modules/packet_processor";
import RpcType from "./modules/rpc_type";
import { Main } from "./sync_socket";

export class Monster {
    public static serverName: string = "3002";
    public static instance: Monster = null;
    private data: M;
    private respawnTime: number = 15;

    public static async init(name: string): Promise<Monster> {
        if (!Monster.instance) {
            Monster.instance = new Monster();
        }
        await Monster.instance.getMonster(name);

        return Monster.instance;
    }

    public beAttack(dmg: number, name: string) {
        let c: Content = { type: RpcType.AttackLog, target: "monster", body: "0", name, isGameOver: true };
        if (this.data.hp <= 0) {
            Main.write(Packer(c));
            return;
        }

        // 傷害校正
        if (this.data.hp - dmg <= 0) {
            dmg = this.data.hp;
            this.data.hp = 0;
            this.data.ks = name;
            this.sync(); // 確實被傷害到-同步回game-server

            c = { type: RpcType.AttackLog, target: "monster", body: dmg.toString(), name, ks: true, isGameOver: true };
            console.log("玩家", name, "擊殺鳳凰");
            this.monsterDie();
            Main.write(Packer(c));

            return;
        }

        this.data.hp -= dmg;
        this.sync(); // 確實被傷害到-同步回game-server
        c = { type: RpcType.AttackLog, target: "monster", body: dmg.toString(), name, isGameOver: false };
        Main.write(Packer(c));
    }

    public monsterDie(): void {
        this.update(this.data)
            .then(() => {
                setTimeout(async () => {
                    this.createMonsterByName("鳳凰").catch((err) => {
                        console.log(err);
                    });
                }, 1000 * this.respawnTime);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    public getMonster(name: string): Promise<void> {
        return new Promise((res, rej): void => {
            Db.query("SELECT * FROM monster WHERE name = ? ORDER BY id DESC LIMIT 1;", name, (err, row) => {
                if (err) {
                    console.log("Can't get Monster data");
                    return rej(err);
                }

                if (!row[0]) {
                    this.data = { id: 0, name, hp: 0, ks: "" };
                    console.log("No Monster data");
                    return res();
                }
                this.data = row[0];
                res();
            });
        });
    }

    public createMonsterByName(name: string): Promise<void> {
        return new Promise((res, rej): void => {
            Db.query("INSERT INTO `monster` ( `name`,`ks`, `born_at`) VALUES ( ? ,'', NOW())", name, (err, row) => {
                if (err) {
                    console.log("ERROR! Can't create Monster");
                    return rej(err);
                }
                console.log("Phoenix respawn!!");
                this.data = { id: row.insertId, name, hp: 10000, ks: "" };
                this.sync();
                res();
            });
        });
    }

    public update(data: M): Promise<void> {
        return new Promise((res, rej): void => {
            Db.query(
                "UPDATE `monster` SET `hp` = ?, `ks` = ? WHERE `monster`.`id` = ?",
                [data.hp, data.ks, data.id],
                (err, row) => {
                    if (err) {
                        console.log("ERROR! Can't update Monster");
                        return rej(err);
                    }
                    console.log("Phoenix update");
                    this.data = data;

                    res();
                }
            );
        });
    }

    public sync() {
        const c: Content = { type: RpcType.Sync, target: "monster", body: JSON.stringify(this.data), name: "3002" };
        console.log("sync", c);
        Main.write(Packer(c));
    }
}
