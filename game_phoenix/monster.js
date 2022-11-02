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
    static reborn() {
        db_1.default.query("INSERT INTO monster (name, hp) VALUES (?, ?)", ["鳳凰", 10000], (err) => {
            if (err) {
                throw err;
            }
            console.log("鳳凰已經重生");
        });
    }
    async init() {
        return new Promise((res, rej) => {
            const sql = "SELECT * FROM monster WHERE name = ? ORDER BY born_at DESC LIMIT 1";
            db_1.default.query(sql, this.name, (err, [row]) => {
                if (err) {
                    throw err;
                }
                this.data = row;
                res();
            });
        });
    }
    getData() {
        return this.data;
    }
    beAttack(dmg, playerName) {
        this.data.hp -= dmg;
        if (this.data.hp <= 0) {
            this.data.ks = playerName;
            console.log("SQL", this.data.hp, playerName, this.data.id);
            db_1.default.query("UPDATE monster SET hp = ?, ks = ? WHERE id = ?;", [this.data.hp, playerName, this.data.id], (err) => {
                if (err) {
                    throw err;
                }
            });
        }
    }
}
exports.Monster = Monster;
