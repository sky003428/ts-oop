import { Monster } from "./monster";
import Net from "net";
import { Player, P } from "./player";

export interface GameLog {
    err: boolean;
    msg: string;
    data?: R;
}

export interface R {
    type: string;
    body: string;
    name?: string;
    isGameOver?: boolean;
}

export class Game {
    public monster: Monster = new Monster("鳳凰");
    // public clients = new Map<string, Net.Socket>();
    public players = new Map<string, Player>();
    public playingPlayers: Player[] = [];
    // public isPlaying: boolean = false;
    private output: R;
    private log: GameLog = { err: false, msg: "" };

    public isValid(i: string, socket: Net.Socket): GameLog {
        let data: R;
        try {
            data = JSON.parse(i);
        } catch (error) {
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

        return { ...this.log, data };
    }

    public async login(loginName: string, socket: Net.Socket): Promise<GameLog> {
        this.log = { err: false, msg: "" };
        let playerData: P;

        try {
            playerData = await Player.getPlayerByName(loginName);
        } catch (err) {
            this.log.err = true;
            this.log.msg = "ERROR! Server can't get player data\n" + err;
            this.output = { type: "err", body: "ERROR! Server can't get player data" };
            this.sendOutput(socket);
            return this.log;
        }

        if (!playerData) {
            try {
                playerData = await Player.createPlayerByName(loginName);
            } catch (err) {
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

        this.players.set(name, new Player(id, name, feather, title, socket));
        return this.log;
    }

    public async start(): Promise<GameLog> {
        this.log = { err: false, msg: "" };
        try {
            this.monster.setData(await this.monster.init());
        } catch (err) {
            this.log.err = true;
            this.log.msg = "ERROR! Server Can't init monster\n" + err;
            console.log(this.log);
            return this.log;
        }
        if (this.monster.getData()?.id) {
            console.log(`怪物 ${this.monster.getData().name},血量:${this.monster.getData().hp} \n`);
        } else {
            await this.monster.respawn().catch((err) => {
                console.log(err);
            });
        }
        return this.log;
    }

    public play(name: string, socket: Net.Socket) {
        const player = this.players.get(name);

        if (this.monster.getData().hp < 0) {
            this.sendOutput(socket, { type: "msg", body: "Monster was already died!" });
            return;
        }
        if (this.players.get(name).isOver()) {
            this.sendOutput(socket, { type: "msg", body: "You've already kill monster!" });
            return;
        }

        const ind = this.playingPlayers.findIndex((p) => p.name == name);
        if (ind > -1) {
            this.playingPlayers.splice(ind, 1);
        }
        this.playingPlayers.push(player);

        let dmg: number = player.attack(this.monster.getData().hp);
        this.monster.beAttack(dmg);

        if (this.monster.getData().hp > 0) {
            const output: R = {
                type: "fightLog",
                body: `Player ${name}: Attack ${dmg} damages - total:${player.attackTimes} times, ${player.totalDamage} damages`,
                isGameOver: false,
            };
            this.sendOutput(player.socket, output);
        } else {
            // this.isPlaying = false;
            const output: R = { type: "fightLog", body: "", isGameOver: true };

            this.monster.monsterDie(name).catch((err) => {
                console.log(err);
            });
            player.updateFeather().catch((err) => {
                console.log("Error!Server can't updateFeather\n" + err);
            });

            this.playingPlayers.forEach((player) => {
                output.body = `Phoenix had been killed, Attack:${player.attackTimes} times - ${player.totalDamage} damages`;
                if (player.name == this.monster.getData().ks) {
                    output.body += `, Get "Feather"`;
                } else {
                    output.type = "req";
                    output.body += ", Wait for next Phoenix? [y/n]";
                }
                this.sendOutput(player.socket, output);
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

    // public canPlayed(): boolean {
    //     if (this.playingPlayers.length > 0 && this.monster.getData().hp > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    public sendOutput(socket: Net.Socket, op: R = this.output): void {
        socket.write(JSON.stringify(op));
    }

    public logOut(port: number) {
        const playerCopy = new Map<string, Player>(this.players);
        this.playingPlayers = this.playingPlayers.filter((p) => p.socket.remotePort != port);
        playerCopy.forEach((player: Player, key: string) => {
            if (port == player.socket.remotePort) {
                this.players.delete(key);
            }
        });
    }
}
