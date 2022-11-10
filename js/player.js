"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const db_1 = __importDefault(require("./db"));
class Player {
    constructor(id, name, feather, title) {
        this.totalDamage = 0;
        this.attackTimes = 0;
        this.id = id;
        this.name = name;
        this.feather = feather;
        this.title = title;
    }
    static getPlayerByName(name) {
        return new Promise((res, rej) => {
            db_1.default.query("SELECT * FROM player WHERE name = ?", name, (err, row) => {
                if (err) {
                    return rej(err);
                }
                if (row[0]) {
                    row[0].title = JSON.parse(row[0].title);
                    res(JSON.parse(JSON.stringify(row[0])));
                }
                else {
                    res(undefined);
                }
            });
        });
    }
    static createPlayerByName(name) {
        return new Promise((res, rej) => {
            db_1.default.query("INSERT INTO `player` (`name`) VALUES (?)", name, (err, row) => {
                if (err) {
                    return rej(err);
                }
                res({ id: row.insertId, name, feather: false, title: [] });
            });
        });
    }
    attack() {
        const dmg = Math.ceil(Math.random() * 9);
        ++this.attackTimes;
        this.totalDamage += dmg;
        return dmg;
    }
    updateFeather() {
        this.feather = true;
        return new Promise((res, rej) => {
            db_1.default.query("UPDATE player SET feather = 1 WHERE id = ?", this.id, (err, row) => {
                if (err) {
                    return rej(err);
                }
                res("st");
            });
        });
    }
    isGameOver() {
        return this.feather || this.title.includes("勇者");
    }
}
exports.Player = Player;
