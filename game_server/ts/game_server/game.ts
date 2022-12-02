import Net from "net";
import { Packer } from "../modules/packet_processor";
import Monster from "./monster";
import Player from "./player";
import Output from "../modules/handle_output";

export class Game {
    public static instance: Game = null;
    public players = new Map<string, Player>();
    public playingPlayers = new Map<string, Player>();
    public monster: Monster = new Monster("鳳凰");
    private attackQueue: string[] = [];
    private attackLoopTimer: NodeJS.Timer;
    private tickRate: number = 20;

    public static init(): Game {
        if (!this.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }
    // 驗證是否登入
    public isLogged(name: string, socket: Net.Socket): boolean {
        if (!this.players.get(name)) {
            this.sendOutput(socket, Output(name).err.login);
            return false;
        }
        this.players.get(name).socket = socket;
        return true;
    }

    public enterAttackQueue(name: string, socket: Net.Socket) {
        const player = this.players.get(name);
        this.playingPlayers.set(name, player);

        // 已在隊列
        if (this.attackQueue.includes(name) || player.gameOverSend) {
            return;
        }
        // 判斷是否擊殺過
        if (player.feather || player.title.includes("勇者")) {
            this.sendOutput(socket, Output(name).fightLog.alreadyKill);
            return;
        }
        // 判斷怪物是否存活
        if (this.monster.getData().hp <= 0) {
            this.sendOutput(socket, Output(name).fightLog.alreadyDied);
            this.sendOutput(socket, Output(name).req.waitMonster);

            return;
        }

        this.attackQueue.push(name);
        this.openTimer();
    }

    private openTimer(): void {
        if (this.attackLoopTimer) return;
        console.log("開啟timer");
        this.attackLoopTimer = setInterval(() => {
            if (this.attackQueue.length == 0) {
                this.closeTimer();
                return;
            }
            this.fightLoop();
        }, 1000 / this.tickRate);
    }
    private closeTimer(): void {
        console.log("關閉timer");
        clearTimeout(this.attackLoopTimer);
        this.attackLoopTimer = null;
    }

    private fightLoop(): void {
        // 玩家進入戰鬥
        // this.playingPlayers.set(name, player);
        for (let name of this.attackQueue) {
            const player: Player = this.players.get(name);

            const dmg = player.attack();
            this.monster.beAttack(dmg, name);
        }
        this.attackQueue = [];
    }

    // 處理玩家回應
    public response(name: string, socket: Net.Socket, body: string) {
        const player = this.players.get(name);
        player.gameOverSend = false;
        // valid
        if (player.feather || player.title.includes("勇者")) {
            const c: Content = Output(name).fightLog.alreadyKill;
            this.sendOutput(socket, c);
            return;
        }

        if (body == "false") {
            this.sendOutput(socket, Output(name).msg.bye, true);
        }

        if (body == "true") {
            this.playingPlayers.set(name, player);
            this.attackQueue.push(name);
            console.log("push進q");
            console.log("monster hp", this.monster.getData().hp);
            if (this.monster.getData().hp <= 0) {
                console.log("怪死的");
                this.sendOutput(socket, Output(name).msg.waiting);
            } else {
                this.openTimer();
            }
        }
    }

    // 從Login Server同步玩家登入資料
    public syncPlayer(player: P) {
        const { id, name, feather, title } = player;

        // 重複登入
        if (game.players.get(name)) {
            this.sendOutput(game.players.get(name).socket, Output(name).err.repeatLog, true);
        }

        game.players.set(name, new Player(id, name, feather, title));
    }

    // Monster Server
    public handleAttackLog(c: Content) {
        const { body, name, ks, isGameOver } = c;
        const trueDamage = +body;
        const p: Player = this.playingPlayers.get(name);
        let { total, time } = p.getAttackLog();

        // 已傳送遊戲結束
        if (p.gameOverSend) {
            return;
        }

        // 怪死 從未攻擊
        if (trueDamage == 0 && total == 0) {
            this.sendOutput(p.socket, Output(name).fightLog.alreadyDied);
            p.gameOverSend = true;
            return;
        }
        // 怪死 無尾刀
        if (trueDamage == 0 && total > 0) {
            this.sendOutput(p.socket, Output(name).attackOver(total, time));
            this.sendOutput(p.socket, Output(name).req.waitMonster);
            p.initialFightLog();
            p.gameOverSend = true;
            return;
        }

        // 更新本次攻擊紀錄
        total = p.setAttackLog().total(total + trueDamage);
        time = p.setAttackLog().time(time + 1);

        this.sendOutput(p.socket, Output(name).attacking(trueDamage, total, time));

        // 攻擊到
        // 怪死 且尾刀
        if (ks) {
            this.sendOutput(p.socket, Output(name).killSteal(total, time));
            p.getFeather();
            p.initialFightLog();
            p.gameOverSend = true;
        }
    }

    //  從Monster Server同步怪物資料
    public syncMonster(monsterData: M) {
        const isRespawn: boolean = game.monster.setData(monsterData);
        if (isRespawn) {
            this.openTimer();
        }
    }

    // 處理回覆玩家
    private sendOutput(socket: Net.Socket, content: Content, end: boolean = false): void {
        if (end) {
            socket.end(Packer(content));
            return;
        }
        socket.write(Packer(content));
    }

    public logout(port: number): void {
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

export const game = Game.init();
