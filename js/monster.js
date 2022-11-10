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
    }
    async init() {
        return new Promise((res, rej) => {
            db_1.default.query("SELECT * FROM monster WHERE name = ? AND hp >= 0 ORDER BY born_at DESC LIMIT 1", this.name, (err, row) => {
                if (err) {
                    return rej(err);
                }
                res(row[0]);
            });
        });
    }
    // todo:開機沒怪自動生
    static respawn() {
        return new Promise((res, rej) => {
            db_1.default.query("INSERT INTO monster (name, hp) VALUES (?, ?)", ["鳳凰", 10000], (err, row) => {
                if (err) {
                    return rej(err);
                }
                console.log("phoenix reborn!!");
                res({ id: row.insertId, name: "鳳凰", hp: 10000, ks: "" });
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
        console.log("kill by", playerName);
        return new Promise((res, rej) => {
            this.data.ks = playerName;
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
