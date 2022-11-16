"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const monster_1 = require("./monster");
const player_1 = require("./player");
class Game {
    constructor() {
        this.monster = new monster_1.Monster("鳳凰");
        this.players = new Map();
        this.playingPlayers = new Map();
        this.slaverServer = new Map();
        this.respawnTime = 25;
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
        // 判斷有沒有key type,body,name 型別
        if (!(typeof data.type == "string") || !(typeof data.body == "string") || !(typeof data.name == "string")) {
            const output = { type: "err", body: "Incorrect resquest", name: data.name };
            this.sendOutput(socket, output);
            return { err: true, msg: "Incorrect resquest" };
        }
        return Object.assign(Object.assign({}, this.log), { data });
    }
    async login(loginName, socket, sync) {
        this.log = { err: false, msg: "" };
        let playerData;
        try {
            playerData = await player_1.Player.getPlayerByName(loginName);
        }
        catch (err) {
            this.log.err = true;
            this.log.msg = "ERROR! Server can't get player data\n" + err;
            this.output = { type: "err", body: "ERROR! Server can't get player data", name: loginName };
            this.sendOutput(socket);
            return this.log;
        }
        if (!playerData) {
            try {
                playerData = await player_1.Player.createPlayerByName(loginName);
            }
            catch (err) {
                this.log.err = true;
                this.log.msg = "ERROR! Server can't create player\n" + err;
                this.output = { type: "err", body: "ERROR! Server can't create player", name: loginName };
                this.sendOutput(socket);
                return this.log;
            }
        }
        const { id, name, feather, title } = playerData;
        this.output = { type: "msg", body: `player${id} - ${name} has logined, Title:${title}`, name: loginName };
        if (this.monster.getData().id) {
            this.output.body += `Phoenix hp:${this.monster.getData().hp}`;
        }
        this.players.set(name, new player_1.Player(id, name, feather, title, socket));
        this.sendOutput(socket);
        return this.log;
    }
    async start() {
        var _a;
        this.log = { err: false, msg: "" };
        try {
            this.monster.setData(await this.monster.init());
        }
        catch (err) {
            this.log.err = true;
            this.log.msg = "ERROR! Server Can't init monster\n" + err;
            console.log(this.log);
            return this.log;
        }
        if ((_a = this.monster.getData()) === null || _a === void 0 ? void 0 : _a.id) {
            console.log(`怪物 ${this.monster.getData().name},血量:${this.monster.getData().hp} \n`);
        }
        else {
            await this.monster.respawn().catch((err) => {
                console.log(err);
            });
        }
        return this.log;
    }
    play(name, socket) {
        const player = this.players.get(name);
        if (player.isOver()) {
            this.sendOutput(socket, { type: "fightLog", body: "You've already kill monster!", name, isGameOver: true });
            return;
        }
        if (this.monster.getData().hp <= 0) {
            this.sendOutput(socket, { type: "fightLog", body: "Monster was already died!", name, isGameOver: true });
            return;
        }
        this.playingPlayers.set(name, player);
        let dmg = player.attack(this.monster.getData().hp);
        this.monster.beAttack(dmg);
        const output = {
            type: "fightLog",
            body: `Player ${name}: Attack ${dmg} damages - total:${player.attackTimes} times, ${player.totalDamage} damages`,
            isGameOver: this.monster.getData().hp <= 0,
            name,
        };
        this.sendOutput(player.socket, output);
        // 怪物死亡
        if (this.monster.getData().hp <= 0) {
            this.monster.monsterDie(name).catch((err) => {
                console.log(err);
            });
            this.monster.sync(this.slaverServer);
            player.updateFeather().catch((err) => {
                console.log("Error!Server can't updateFeather\n" + err);
            });
            this.playingPlayers.forEach((p) => {
                const output = {
                    type: "fightLog",
                    body: "",
                    isGameOver: true,
                    name: "",
                };
                output.name = p.name;
                if (p.name == this.monster.getData().ks) {
                    output.body = `Phoenix had been killed, Attack:${p.attackTimes} times - ${p.totalDamage} damages, Get "Feather"`;
                }
                else {
                    output.type = "req";
                    output.body += `Phoenix had been killed, Attack:${p.attackTimes} times - ${p.totalDamage} damages, Wait for next Phoenix? [y/n]`;
                }
                console.log(p.name, "回傳訊息");
                this.sendOutput(p.socket, output);
                p.initAttackLog();
            });
            this.playingPlayers.clear();
            console.log(`Phoenix respawn in ${this.respawnTime}s`);
            setTimeout(() => {
                this.monster
                    .respawn()
                    .then(() => {
                    this.monster.sync(this.slaverServer);
                    this.playingPlayers.forEach((p) => {
                        this.play(p.name, p.socket);
                    });
                })
                    .catch((err) => {
                    console.log("Error!Server can't respawn monster\n" + err);
                });
            }, 1000 * this.respawnTime);
        }
    }
    sendOutput(socket, op = this.output) {
        socket.write(JSON.stringify(op));
    }
    logOut(port) {
        const playerCopy = new Map(this.players);
        playerCopy.forEach((player, key) => {
            if (port == player.socket.remotePort) {
                this.players.delete(key);
                this.playingPlayers.delete(key);
            }
        });
    }
    logOutByName(name) {
        this.players.delete(name);
        this.playingPlayers.delete(name);
    }
}
exports.Game = Game;
