"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monster = void 0;
const db_1 = __importDefault(require("./db"));
class Monster {
    constructor(name) {
        this.name = name;
        this.name = name;
    }
    async init() {
        return new Promise((res, rej) => {
            db_1.default.query("SELECT * FROM monster WHERE name = ? AND hp > 0 ORDER BY born_at DESC LIMIT 1", this.name, (err, row) => {
                if (err) {
                    return rej(err);
                }
                res(row[0]);
            });
        });
    }
    respawn() {
        return new Promise((res, rej) => {
            db_1.default.query("INSERT INTO monster (name, hp) VALUES (?, ?)", [this.name, 10000], (err, row) => {
                if (err) {
                    return rej(err);
                }
                console.log("Phoenix respawn!!");
                this.data = { id: row.insertId, name: this.name, hp: 10000, ks: "" };
                res();
            });
        });
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
    }
    beAttack(dmg) {
        this.data.hp -= dmg;
    }
    monsterDie(playerName) {
        console.log("Phoenix was killed by:", playerName);
        this.data.ks = playerName;
        return new Promise((res, rej) => {
            db_1.default.query("UPDATE monster SET hp = ?, ks = ? WHERE id = ?;", [this.data.hp, playerName, this.data.id], (err) => {
                if (err) {
                    return rej(err);
                }
                res();
            });
        });
    }
}
exports.Monster = Monster;
