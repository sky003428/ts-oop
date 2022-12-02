"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.Game = void 0;
const packet_processor_1 = require("../modules/packet_processor");
const monster_1 = __importDefault(require("./monster"));
const player_1 = __importDefault(require("./player"));
const handle_output_1 = __importDefault(require("../modules/handle_output"));
class Game {
    constructor() {
        this.players = new Map();
        this.playingPlayers = new Map();
        this.monster = new monster_1.default("鳳凰");
        this.attackQueue = [];
        this.tickRate = 20;
    }
    static init() {
        if (!this.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }
    // 驗證是否登入
    isLogged(name, socket) {
        if (!this.players.get(name)) {
            this.sendOutput(socket, (0, handle_output_1.default)(name).err.login);
            return false;
        }
        this.players.get(name).socket = socket;
        return true;
    }
    enterAttackQueue(name, socket) {
        const player = this.players.get(name);
        this.playingPlayers.set(name, player);
        // 已在隊列
        if (this.attackQueue.includes(name) || player.gameOverSend) {
            return;
        }
        // 判斷是否擊殺過
        if (player.feather || player.title.includes("勇者")) {
            this.sendOutput(socket, (0, handle_output_1.default)(name).fightLog.alreadyKill);
            return;
        }
        // 判斷怪物是否存活
        if (this.monster.getData().hp <= 0) {
            this.sendOutput(socket, (0, handle_output_1.default)(name).fightLog.alreadyDied);
            this.sendOutput(socket, (0, handle_output_1.default)(name).req.waitMonster);
            return;
        }
        this.attackQueue.push(name);
        this.openTimer();
    }
    openTimer() {
        if (this.attackLoopTimer)
            return;
        console.log("開啟timer");
        this.attackLoopTimer = setInterval(() => {
            if (this.attackQueue.length == 0) {
                this.closeTimer();
                return;
            }
            this.fightLoop();
        }, 1000 / this.tickRate);
    }
    closeTimer() {
        console.log("關閉timer");
        clearTimeout(this.attackLoopTimer);
        this.attackLoopTimer = null;
    }
    fightLoop() {
        // 玩家進入戰鬥
        // this.playingPlayers.set(name, player);
        for (let name of this.attackQueue) {
            const player = this.players.get(name);
            const dmg = player.attack();
            this.monster.beAttack(dmg, name);
        }
        this.attackQueue = [];
    }
    // 處理玩家回應
    response(name, socket, body) {
        const player = this.players.get(name);
        player.gameOverSend = false;
        // valid
        if (player.feather || player.title.includes("勇者")) {
            const c = (0, handle_output_1.default)(name).fightLog.alreadyKill;
            this.sendOutput(socket, c);
            return;
        }
        if (body == "false") {
            this.sendOutput(socket, (0, handle_output_1.default)(name).msg.bye, true);
        }
        if (body == "true") {
            this.playingPlayers.set(name, player);
            this.attackQueue.push(name);
            console.log("push進q");
            console.log("monster hp", this.monster.getData().hp);
            if (this.monster.getData().hp <= 0) {
                console.log("怪死的");
                this.sendOutput(socket, (0, handle_output_1.default)(name).msg.waiting);
            }
            else {
                this.openTimer();
            }
        }
    }
    // 從Login Server同步玩家登入資料
    syncPlayer(player) {
        const { id, name, feather, title } = player;
        // 重複登入
        if (exports.game.players.get(name)) {
            this.sendOutput(exports.game.players.get(name).socket, (0, handle_output_1.default)(name).err.repeatLog, true);
        }
        exports.game.players.set(name, new player_1.default(id, name, feather, title));
    }
    // Monster Server
    handleAttackLog(c) {
        const { body, name, ks, isGameOver } = c;
        const trueDamage = +body;
        const p = this.playingPlayers.get(name);
        let { total, time } = p.getAttackLog();
        // 已傳送遊戲結束
        if (p.gameOverSend) {
            return;
        }
        // 怪死 從未攻擊
        if (trueDamage == 0 && total == 0) {
            this.sendOutput(p.socket, (0, handle_output_1.default)(name).fightLog.alreadyDied);
            p.gameOverSend = true;
            return;
        }
        // 怪死 無尾刀
        if (trueDamage == 0 && total > 0) {
            this.sendOutput(p.socket, (0, handle_output_1.default)(name).attackOver(total, time));
            this.sendOutput(p.socket, (0, handle_output_1.default)(name).req.waitMonster);
            p.initialFightLog();
            p.gameOverSend = true;
            return;
        }
        // 更新本次攻擊紀錄
        total = p.setAttackLog().total(total + trueDamage);
        time = p.setAttackLog().time(time + 1);
        this.sendOutput(p.socket, (0, handle_output_1.default)(name).attacking(trueDamage, total, time));
        // 攻擊到
        // 怪死 且尾刀
        if (ks) {
            this.sendOutput(p.socket, (0, handle_output_1.default)(name).killSteal(total, time));
            p.getFeather();
            p.initialFightLog();
            p.gameOverSend = true;
        }
    }
    //  從Monster Server同步怪物資料
    syncMonster(monsterData) {
        const isRespawn = exports.game.monster.setData(monsterData);
        if (isRespawn) {
            this.openTimer();
        }
    }
    // 處理回覆玩家
    sendOutput(socket, content, end = false) {
        if (end) {
            socket.end((0, packet_processor_1.Packer)(content));
            return;
        }
        socket.write((0, packet_processor_1.Packer)(content));
    }
    logout(port) {
        for (let [name, player] of this.players) {
            if (port == player.socket.remotePort) {
                this.players.delete(name);
                this.playingPlayers.delete(name);
                this.attackQueue.splice(this.attackQueue.indexOf(name), 1);
                console.log(`Player: ${name} has disconnected`);
                break;
            }
        }
    }
}
exports.Game = Game;
Game.instance = null;
exports.game = Game.init();
