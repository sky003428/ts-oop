"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monster = void 0;
const db_1 = __importDefault(require("./modules/db"));
const packet_processor_1 = require("./modules/packet_processor");
const rpc_type_1 = __importDefault(require("./modules/rpc_type"));
const sync_socket_1 = require("./sync_socket");
class Monster {
    constructor() {
        this.respawnTime = 15;
    }
    static async init(name) {
        if (!Monster.instance) {
            Monster.instance = new Monster();
        }
        await Monster.instance.getMonster(name);
        return Monster.instance;
    }
    beAttack(dmg, name) {
        let c = { type: rpc_type_1.default.AttackLog, target: "monster", body: "0", name, isGameOver: true };
        if (this.data.hp <= 0) {
            sync_socket_1.Main.write((0, packet_processor_1.Packer)(c));
            return;
        }
        // 傷害校正
        if (this.data.hp - dmg <= 0) {
            dmg = this.data.hp;
            this.data.hp = 0;
            this.data.ks = name;
            this.sync(); // 確實被傷害到-同步回game-server
            c = { type: rpc_type_1.default.AttackLog, target: "monster", body: dmg.toString(), name, ks: true, isGameOver: true };
            console.log("玩家", name, "擊殺鳳凰");
            this.monsterDie();
            sync_socket_1.Main.write((0, packet_processor_1.Packer)(c));
            return;
        }
        this.data.hp -= dmg;
        this.sync(); // 確實被傷害到-同步回game-server
        c = { type: rpc_type_1.default.AttackLog, target: "monster", body: dmg.toString(), name, isGameOver: false };
        sync_socket_1.Main.write((0, packet_processor_1.Packer)(c));
    }
    monsterDie() {
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
    getMonster(name) {
        return new Promise((res, rej) => {
            db_1.default.query("SELECT * FROM monster WHERE name = ? ORDER BY id DESC LIMIT 1;", name, (err, row) => {
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
    createMonsterByName(name) {
        return new Promise((res, rej) => {
            db_1.default.query("INSERT INTO `monster` ( `name`,`ks`, `born_at`) VALUES ( ? ,'', NOW())", name, (err, row) => {
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
    update(data) {
        return new Promise((res, rej) => {
            db_1.default.query("UPDATE `monster` SET `hp` = ?, `ks` = ? WHERE `monster`.`id` = ?", [data.hp, data.ks, data.id], (err, row) => {
                if (err) {
                    console.log("ERROR! Can't update Monster");
                    return rej(err);
                }
                console.log("Phoenix update");
                this.data = data;
                res();
            });
        });
    }
    sync() {
        const c = { type: rpc_type_1.default.Sync, target: "monster", body: JSON.stringify(this.data), name: "3002" };
        console.log("sync", c);
        sync_socket_1.Main.write((0, packet_processor_1.Packer)(c));
    }
}
exports.Monster = Monster;
Monster.serverName = "3002";
Monster.instance = null;
