import db from "../modules/db";
import Net from "net";
import { Packer } from "../modules/packet_processor";
import { Main } from "../sync_socket";
import RpcType from "../modules/rpc_type";

export interface P {
    id: number;
    name: string;
    feather: boolean;
    title: string[];
}

export class Login {
    public static instance: Login = null;
    private socket: Net.Socket;
    private name: string;
    private output: Content;

    constructor(name: string, socket: Net.Socket) {
        this.name = name;
        this.socket = socket;
    }

    public getPlayerByName(): Promise<P> {
        return new Promise((res, rej): void => {
            db.query("SELECT * FROM player WHERE name = ?", this.name, (err, row) => {
                if (err) {
                    this.output = { type: RpcType.Error, body: "ERROR! Can't get player", name: this.name };
                    return rej(err);
                }
                if (row[0]) {
                    row[0].title = JSON.parse(row[0].title);
                    this.output = { type: "login", body: "", success: true, name: this.name };
                    res(JSON.parse(JSON.stringify(row[0])));
                } else {
                    res(null);
                }
            });
        });
    }

    public createPlayerByName(): Promise<P> {
        return new Promise((res, rej): void => {
            db.query("INSERT INTO `player` (`name`) VALUES (?)", this.name, (err, row) => {
                if (err) {
                    this.output = { type: RpcType.Error, body: "ERROR! Can't create player", name: this.name };
                    return rej(err);
                }
                this.output = { type: RpcType.Login, body: "Welcome!", success: true, name: this.name };
                res({ id: row.insertId, name: this.name, feather: false, title: [] });
            });
        });
    }

    public sendOutput(c: Content = this.output) {
        console.log("send", c);
        this.socket.write(Packer(c));
    }

    public syncPlayer(player: P) {
        const output: Content = { type: RpcType.Sync, body: JSON.stringify(player), name: "3000", target: "player" };
        Main.write(Packer(output));
    }
}
