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
    static respawn() {
        return new Promise((res, rej) => {
            db_1.default.query("INSERT INTO monster (name, hp) VALUES (?, ?)", ["鳳凰", 10000], (err) => {
                if (err) {
                    return rej(err);
                }
                console.log("phoenix reborn!!");
                res();
            });
        });
    }
    init() {
        return new Promise((res, rej) => {
            db_1.default.query("SELECT * FROM monster WHERE name = ? ORDER BY born_at DESC LIMIT 1", this.name, (err, row) => {
                if (err) {
                    return rej(err);
                }
                res(row[0]);
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
