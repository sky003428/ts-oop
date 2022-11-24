"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monster = void 0;
const db_1 = __importDefault(require("./modules/db"));
const packet_processor_1 = require("./modules/packet_processor");
class Monster {
    constructor() {
        this.serverName = "3002";
    }
    getMonster(name) {
        return new Promise((res, rej) => {
            db_1.default.query("SELECT * FROM monster WHERE name = ? ORDER BY id DESC LIMIT 1;", name, (err, row) => {
                if (err) {
                    // todo
                    this.output = { type: "err", body: "ERROR! Can't get monster", name: this.serverName };
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
    createMonsterByName(name) {
        return new Promise((res, rej) => {
            db_1.default.query("INSERT INTO `monster` ( `name`,`ks`, `born_at`) VALUES ( ? ,'', NOW())", name, (err, row) => {
                if (err) {
                    this.output = { type: "err", body: "ERROR! Can't create player", name: this.serverName };
                    return rej(err);
                }
                console.log("Phoenix respawn!!");
                this.data = { id: row.insertId, name, hp: 10000, ks: "" };
                res();
            });
        });
    }
    update(data) {
        return new Promise((res, rej) => {
            db_1.default.query("UPDATE `monster` SET `hp` = ?, `ks` = ? WHERE `monster`.`id` = ?", [data.hp, data.ks, data.id], (err, row) => {
                if (err) {
                    this.output = { type: "err", body: "ERROR! Can't create player", name: data.name };
                    return rej(err);
                }
                console.log("Phoenix update");
                this.data = data;
                res();
            });
        });
    }
    sync(main) {
        const c = { type: "sync", target: "monster", body: JSON.stringify(this.data), name: "3002" };
        console.log("sync", c);
        main.write((0, packet_processor_1.Packer)(c));
    }
}
exports.Monster = Monster;