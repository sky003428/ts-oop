"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const monster_1 = require("./monster");
class Game {
    constructor() {
        this.monster = new monster_1.Monster("鳳凰");
        this.players = new Map();
        this.playingPlayers = new Map();
        this.log = { err: false, msg: "" };
    }
    isValid(i, socket) {
        let data;
        try {
            data = JSON.parse(i);
        }
        catch (error) {
            this.log.err = true;
            this.log.msg = error;
            return this.log;
        }
        // 判斷有沒有key type,body 型別
        if (!(typeof data.type == "string") || !(typeof data.body == "string")) {
            this.output = { type: "err", body: "Incorrect resquest" };
            this.sendOutput(socket);
            return { err: true, msg: "Incorrect resquest" };
        }
        return Object.assign(Object.assign({}, this.log), { data });
    }
    login(name, socket) {
        this.players.set(name, socket);
    }
    canPlay(name, socket) {
        if (this.monster.getData().hp <= 0) {
            this.sendOutput(socket, { type: "fightLog", body: "Monster was already died!", name, isGameOver: true });
            return false;
        }
        return true;
    }
    sendOutput(socket, op = this.output) {
        socket.write(JSON.stringify(op));
    }
    logOut(port) {
        const playerCopy = new Map(this.players);
        for (let [name, socket] of playerCopy) {
            if (port == socket.remotePort) {
                this.players.delete(name);
                return name;
            }
        }
    }
}
exports.Game = Game;
