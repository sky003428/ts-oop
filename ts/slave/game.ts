import Net from "net";
import { Monster } from "./monster";

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
    target?: string;
}

export class Game {
    public monster: Monster = new Monster("鳳凰");
    public players = new Map<string, Net.Socket>();
    public playingPlayers = new Map<string, Net.Socket>();
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

    public login(name: string, socket: Net.Socket): void {
        
        this.players.set(name, socket);
    }

    public canPlay(name: string, socket: Net.Socket): boolean {
        if (this.monster.getData().hp <= 0) {
            this.sendOutput(socket, { type: "fightLog", body: "Monster was already died!", name, isGameOver: true });
            return false;
        }
        return true;
    }

    public sendOutput(socket: Net.Socket, op: R = this.output): void {
        socket.write(JSON.stringify(op));
    }

    public logOut(port: number): string {
        const playerCopy = new Map<string, Net.Socket>(this.players);

        for (let [name, socket] of playerCopy) {
            if (port == socket.remotePort) {
                this.players.delete(name);
                return name;
            }
        }
    }
}
