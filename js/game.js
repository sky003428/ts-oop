"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const monster_1 = require("./monster");
const player_1 = require("./player");
class Game {
    constructor() {
        this.monster = new monster_1.Monster("鳳凰");
        // public clients = new Map<string, Net.Socket>();
        this.players = new Map();
        this.playingPlayers = [];
        this.isPlaying = false;
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
    async login(loginName, socket) {
        this.log = { err: false, msg: "" };
        let playerData;
        try {
            playerData = await player_1.Player.getPlayerByName(loginName);
        }
        catch (err) {
            this.log.err = true;
            this.log.msg = "ERROR! Server can't get player data\n" + err;
            this.output = { type: "err", body: "ERROR! Server can't get player data" };
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
                this.output = { type: "err", body: "ERROR! Server can't create player" };
                this.sendOutput(socket);
                return this.log;
            }
        }
        const { id, name, feather, title } = playerData;
        this.output = { type: "msg", body: `player${id} - ${name} has logined, Title:${title}` };
        if (this.monster.getData().id) {
            this.output.body += `Phoenix hp:${this.monster.getData().hp}`;
        }
        this.players.set(name, new player_1.Player(id, name, feather, title, socket));
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
    joinPlay(name, socket) {
        if (this.monster.getData().hp < 0) {
            this.output = { type: "msg", body: "Monster was already died!" };
            this.sendOutput(socket);
            return;
        }
        if (this.players.get(name).isGameOver()) {
            this.output = { type: "msg", body: "You've already kill monster!" };
            this.sendOutput(socket);
            return;
        }
        this.playingPlayers.push(name);
    }
    play(name) {
        this.isPlaying = true;
        const player = this.players.get(name);
        let dmg = player.attack(this.monster.getData().hp);
        this.monster.beAttack(dmg);
        if (this.monster.getData().hp > 0) {
            this.output = {
                type: "fightLog",
                body: `Player ${name}: Attack ${dmg} damages - total:${player.attackTimes} times, ${player.totalDamage} damages`,
                isGameOver: false,
            };
            this.sendOutput(player.socket);
        }
        else {
            this.isPlaying = false;
            this.output.isGameOver = true;
            this.monster.monsterDie(name).catch((err) => {
                console.log(err);
            });
            player.updateFeather().catch((err) => {
                console.log("Error!Server can't updateFeather\n" + err);
            });
            this.playingPlayers.forEach((playingName) => {
                const player = this.players.get(playingName);
                this.output.body = `Phoenix had been killed, Attack:${player.attackTimes} times - ${player.totalDamage} damages`;
                if (player.name == this.monster.getData().ks) {
                    this.output.body += `, Get "Feather"`;
                }
            });
        }
        // while (this.monster.getData().hp > 0) {
        //     for (let i = 0; i < this.playingPlayers.length; ++i) {
        //         const pName = this.playingPlayers[i];
        //         const player = this.players.get(pName);
        //         let dmg: number = player.attack(this.monster.getData().hp);
        //         this.monster.beAttack(dmg);
        //         this.output = {
        //             type: "msg",
        //             body: `Player ${pName}: Attack ${dmg} damages - total:${player.attackTimes} times, ${player.totalDamage} damages`,
        //         };
        //         this.sendOutput(player.socket);
        //         if (this.monster.getData().hp <= 0) {
        //             this.isPlaying = false;
        //             this.monster.monsterDie(pName).catch((err) => {
        //                 console.log(err);
        //             });
        //             player.updateFeather().catch((err) => {
        //                 console.log("Error!Server can't updateFeather\n" + err);
        //             });
        //             this.isPlaying = false;
        //             // res(pName);
        //             break;
        //         }
        //     }
        // }
        // new Promise<string>((res) => {
        //     const loop = setInterval(() => {
        //         for (let i = 0; i < this.playingPlayers.length; ++i) {
        //             const pName = this.playingPlayers[i];
        //             const player = this.players.get(pName);
        //             let dmg: number = player.attack(this.monster.getData().hp);
        //             this.monster.beAttack(dmg);
        //             this.output = {
        //                 type: "msg",
        //                 body: `Player ${pName}: Attack ${dmg} damages - total:${player.attackTimes} times, ${player.totalDamage} damages`,
        //             };
        //             this.sendOutput(player.socket);
        //             if (this.monster.getData().hp <= 0) {
        //                 this.isPlaying = false;
        //                 this.monster.monsterDie(pName).catch((err) => {
        //                     console.log(err);
        //                 });
        //                 player.updateFeather().catch((err) => {
        //                     console.log("Error!Server can't updateFeather\n" + err);
        //                 });
        //                 this.isPlaying = false;
        //                 clearInterval(loop);
        //                 res(pName);
        //                 break;
        //             }
        //         }
        //     }, 0);
        // }).then((ksName: string) => {
        //     this.playingPlayers.forEach((pName) => {
        //         const player = this.players.get(pName);
        //         this.output = {
        //             type: "msg",
        //             body: `Phoenix had been killed, Attack:${player.attackTimes} times - ${player.totalDamage} damages`,
        //         };
        //         if (pName == ksName) {
        //             this.output.body += `, Get "Feather"`;
        //         } else {
        //             this.output.type = "req";
        //             this.output.body += ", Wait for next Phoenix?[y/n]";
        //         }
        //         player.initAttackLog();
        //         this.sendOutput(player.socket);
        //     });
        //     this.playingPlayers = [];
        //     console.log("Phoenix respawn at 15s");
        //     setTimeout(() => {
        //         this.monster
        //             .respawn()
        //             .then(() => {
        //                 this.canPlayed() && this.play();
        //             })
        //             .catch((err) => {
        //                 console.log("Error!Server can't respawn monster\n" + err);
        //             });
        //     }, 1000 * 15);
        // });
    }
    canPlayed() {
        if (this.playingPlayers.length > 0 && this.monster.getData().hp > 0 && !this.isPlaying) {
            return true;
        }
        else {
            return false;
        }
    }
    sendOutput(socket) {
        socket.write(JSON.stringify(this.output));
    }
    logOut(port) {
        const playerCopy = new Map(this.players);
        playerCopy.forEach((player, key) => {
            if (port == player.socket.remotePort) {
                this.players.delete(key);
                const index = this.playingPlayers.indexOf(key);
                index > -1 && this.playingPlayers.splice(index, 1);
            }
        });
    }
}
exports.Game = Game;
