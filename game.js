"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        let playerData = await player_1.Player.getPlayerByName(this.input);
        if (!playerData) {
            playerData = await player_1.Player.createPlayerByName(this.input);
        }
        const { id, name, feather, title } = playerData;
        this.player = new player_1.Player(id, name, feather, title);
        this.output = `player${id} - ${this.input}登入 title:${title}`;
    }
    async play() {
        if (this.player.feather || this.player.title.includes("勇者")) {
            this.output = "You had killed phoenix";
            return;
        }
        await this.monster.init();
        const monsterData = this.monster.getData();
        if (!monsterData || (monsterData === null || monsterData === void 0 ? void 0 : monsterData.hp) <= 0) {
            this.output = "Monster already died";
            return;
        }
        let attackTimes = 0;
        let totalDamage = 0;
        while (monsterData.hp > 0) {
            const dmg = this.player.attack();
            ++attackTimes;
            totalDamage += dmg;
            this.monster.beAttack(dmg, this.player.name);
            // console.log(`造成 ${dmg}點傷害,鳳凰hp ${monsterData.hp}`);
            // monsterData = await this.monster.getMonsterData();
            if (monsterData.hp <= 0) {
                this.output = `Phoenix had been killed, Attack${attackTimes}times, ${totalDamage}damages`;
                if (monsterData.ks == this.player.name) {
                    this.output += ', Get "feather"';
                    this.player.updateFeather();
                    this.gameOver = true;
                    setTimeout(() => {
                        monster_1.Monster.reborn();
                    }, 10000);
                }
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
exports.default = Game;
