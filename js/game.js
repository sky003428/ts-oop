"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const player_1 = require("./player");
const monster_1 = require("./monster");
class Game {
    constructor() {
        this.input = "";
        this.output = "";
        this.monster = new monster_1.Monster("鳳凰");
        this.gameOver = false;
    }
    isValid(i) {
        if (typeof i !== "string" || i.length > 255 || i.trim().length < 1) {
            this.output = "Incorrect input";
            return false;
        }
        this.input = i.trim();
        return true;
    }
    async login() {
        let playerData;
        try {
            playerData = await player_1.Player.getPlayerByName(this.input);
        }
        catch (err) {
            this.output = "Error! Sever can't get player data\n" + err;
            return true;
        }
        if (!playerData) {
            try {
                playerData = await player_1.Player.createPlayerByName(this.input);
            }
            catch (err) {
                this.output = "Error! Server can't create player\n" + err;
                return true;
            }
        }
        const { id, name, feather, title } = playerData;
        this.player = new player_1.Player(id, name, feather, title);
        this.output = `player${id} - ${this.input}登入 title:${title}`;
    }
    async play() {
        var _a;
        if (this.player.feather || this.player.title.includes("勇者")) {
            this.output = "You had killed phoenix";
            return true;
        }
        try {
            this.monster.setData(await this.monster.init());
        }
        catch (err) {
            this.output = "Error! Server Can't init monster\n" + err;
            return true;
        }
        if (!this.monster.getData() || ((_a = this.monster.getData()) === null || _a === void 0 ? void 0 : _a.hp) <= 0) {
            this.output = "Monster already died";
            return;
        }
        let attackTimes = 0;
        let totalDamage = 0;
        while (this.monster.getData().hp > 0) {
            const dmg = this.player.attack();
            ++attackTimes;
            totalDamage += dmg;
            this.monster.beAttack(dmg);
            if (this.monster.getData().hp <= 0) {
                try {
                    await this.monster.monsterDie(this.player.name);
                }
                catch (err) {
                    this.output = "Error! Server can't mod monster" + err;
                    return true;
                }
                this.output = `Phoenix had been killed, Attack:${attackTimes} times - ${totalDamage} damages`;
                setTimeout(() => {
                    monster_1.Monster.respawn().catch((err) => {
                        console.log("Error!Server can't respawn monster\n" + err);
                    });
                }, 1000 * 5);
            }
            if (this.monster.getData().ks == this.player.name) {
                this.output += ', Get "feather"';
                await this.player.updateFeather().catch((err) => {
                    console.log("Error!Server can't updateFeather\n" + err);
                });
                this.gameOver = true;
            }
        }
    }
    display() {
        console.log(this.output);
    }
    isOver() {
        return this.gameOver;
    }
}
exports.Game = Game;
