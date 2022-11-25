import Db from "./modules/db";
import Net from "net";
import { Packer } from "./modules/packet_processor";
import RpcType from "./modules/rpc_type";

export class Monster {
    public static serverName: string = "3002";
    public static instance: Monster = null;
    private data: M;
    private output: Content;

    public static async init(name: string): Promise<Monster> {
        if (!Monster.instance) {
            Monster.instance = new Monster();
        }
        await Monster.instance.getMonster(name);

        return Monster.instance;
    }

    public getMonster(name: string): Promise<void> {
        return new Promise((res, rej): void => {
            Db.query("SELECT * FROM monster WHERE name = ? ORDER BY id DESC LIMIT 1;", name, (err, row) => {
                if (err) {
                    // todo
                    this.output = { type: RpcType.Error, body: "ERROR! Can't get monster", name: Monster.serverName };
                    return rej(err);
                }

                if (!row[0]) {
                    this.data = { id: 0, name, hp: 0, ks: "" };
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
                    this.output = { type: RpcType.Error, body: "ERROR! Can't create player", name: Monster.serverName };
                    return rej(err);
                }
                console.log("Phoenix respawn!!");
                this.data = { id: row.insertId, name, hp: 10000, ks: "" };
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
                        this.output = { type: RpcType.Error, body: "ERROR! Can't create player", name: data.name };
                        return rej(err);
                    }
                    console.log("Phoenix update");
                    this.data = data;

                    res();
                }
            );
        });
    }

    public sync(main: Net.Socket) {
        const c: Content = { type: RpcType.Sync, target: "monster", body: JSON.stringify(this.data), name: "3002" };
        console.log("sync", c);
        main.write(Packer(c));
    }
}
