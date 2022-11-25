"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../modules/db"));
class Player {
    constructor(id, name, feather, title) {
        this.overSended = false;
        this.totalDamage = 0;
        this.attacktime = 0;
        this.maxDamage = 10;
        this.id = id;
        this.name = name;
        this.feather = feather;
        this.title = title;
    }
    attack(monsterHp) {
        let dmg = Math.ceil(Math.random() * this.maxDamage) + 5;
        if (dmg > monsterHp) {
            dmg = monsterHp;
        }
        this.totalDamage += dmg;
        ++this.attacktime;
        return dmg;
    }
    getAttackLog() {
        return { total: this.totalDamage, time: this.attacktime };
    }
    initialFightLog() {
        this.totalDamage = 0;
        this.attacktime = 0;
    }
    getFeather() {
        this.feather = true;
        this.update().catch((err) => {
            console.log(err);
        });
    }
    async update() {
        return new Promise((res, rej) => {
            db_1.default.query("UPDATE `player` SET `feather` = ? WHERE id = ?", [this.feather, this.id], (err, okPacket) => {
                if (err) {
                    return rej("Error: Player update error\r\n" + err);
                }
                res();
            });
        });
    }
}
exports.default = Player;
