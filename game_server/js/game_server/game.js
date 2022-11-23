"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.Game = void 0;
const packet_processor_1 = require("../modules/packet_processor");
const monster_1 = __importDefault(require("./monster"));
const player_1 = __importDefault(require("./player"));
class Game {
    constructor() {
        this.players = new Map();
        this.playingPlayers = new Map();
        this.monster = new monster_1.default("鳳凰");
    }
    // 驗證是否登入
    isLogged(name, socket) {
        if (!this.players.get(name)) {
            const c = { type: "err", body: "Error, You haven't logged", name };
            this.sendOutput(socket, c);
            return false;
        }
        this.players.get(name).socket = socket;
        return true;
    }
    async fight(name, socket) {
        const player = this.players.get(name);
        // 判斷是否擊殺過
        if (player.feather || player.title.includes("勇者")) {
            this.sendOutput(socket, {
                type: "fightLog",
                body: "You've already kill the Phoenix",
                name,
                isGameOver: true,
            });
            return;
        }
        // 判斷怪物是否存活
        if (this.monster.data.hp <= 0) {
            // 如果已發送遊戲結束訊息給玩家, 不再發送怪物死亡訊息
            if (player.overSended) {
                return;
            }
            this.sendOutput(socket, { type: "fightLog", body: "Monster has already died", name, isGameOver: true });
            this.sendOutput(socket, {
                type: "req",
                body: `Waitng for next Phoenix? (y/n)`,
                name,
            });
            return;
        }
        // 玩家進入戰鬥
        this.playingPlayers.set(name, player);
        const dmg = player.attack(this.monster.data.hp);
        this.monster.beAttack(dmg);
        // 傳回本次攻擊結果
        this.sendOutput(socket, {
            type: "fightLog",
            body: `You attack Phoenix ${dmg} damage - total: ${player.totalDamage}`,
            name,
            isGameOver: false,
        });
        // 怪物死亡處理
        if (this.monster.data.hp <= 0) {
            this.gameOverTransmit(name);
            this.playingPlayers.clear();
            this.monster.monsterKilledBy(name);
            monster_1.default.create("鳳凰", this.monster.socket);
        }
    }
    // 處理怪物死亡後的廣播, 及ks玩家拿到羽毛
    gameOverTransmit(ksPlayer) {
        this.playingPlayers.forEach((p) => {
            if (p.name == ksPlayer) {
                p.getFeather();
                this.sendOutput(p.socket, {
                    type: "fightLog",
                    body: `You Kill Phoenix, TotalDamage: ${p.totalDamage} - ${p.attacktime} times, Get "Feather"`,
                    name: p.name,
                    isGameOver: true,
                });
            }
            else {
                this.sendOutput(p.socket, {
                    type: "fightLog",
                    body: `Phoenix died, TotalDamage: ${p.totalDamage} - ${p.attacktime} times`,
                    name: p.name,
                    isGameOver: true,
                });
                this.sendOutput(p.socket, {
                    type: "req",
                    body: `Waitng for next Phoenix? (y/n)`,
                    name: p.name,
                });
            }
            p.overSended = true;
            p.initialFightLog();
        });
    }
    // 處理玩家回應
    response(name, socket, body) {
        const player = this.players.get(name);
        // valid
        if (player.feather || player.title.includes("勇者")) {
            const c = { type: "fightLog", body: "You've already kill the Phoenix", name };
            this.sendOutput(socket, c);
            return;
        }
        if (body == "false") {
            const c = { type: "msg", body: "bye", name };
            socket.end((0, packet_processor_1.Packer)(c));
        }
        // 怪還在等待復活
        if (body == "true" && this.monster.data.hp <= 0) {
            this.playingPlayers.set(name, player);
            const c = { type: "msg", body: "Waiting for Phoenix respawn...", name };
            this.sendOutput(socket, c);
        }
        // 怪已復活
        if (body == "true" && this.monster.data.hp > 0) {
            this.fight(name, socket);
        }
    }
    // 處理回覆玩家
    sendOutput(socket, content) {
        socket.write((0, packet_processor_1.Packer)(content));
    }
    // 從Login Server同步玩家登入資料
    syncPlayer(player) {
        const { id, name, feather, title } = player;
        const playerSnap = exports.game.players.get(name);
        if (playerSnap) {
            const c = {
                type: "err",
                body: "this player has been login on another device",
                name: name,
            };
            playerSnap.socket.end((0, packet_processor_1.Packer)(c));
        }
        exports.game.players.set(name, new player_1.default(id, name, feather, title));
    }
    //  從Monster Server同步怪物資料
    syncMonster(monsterData) {
        const isRespawn = exports.game.monster.setData(monsterData);
        if (isRespawn) {
            this.playingPlayers.forEach((p) => {
                this.fight(p.name, p.socket);
            });
        }
    }
    logout(port) {
        for (let [name, player] of this.players) {
            if (port == player.socket.remotePort) {
                this.players.delete(name);
                this.playingPlayers.delete(name);
                console.log(`Player: ${name} has disconnected`);
                break;
            }
        }
    }
}
exports.Game = Game;
exports.game = new Game();
