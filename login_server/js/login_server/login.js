"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const db_1 = __importDefault(require("../modules/db"));
const packet_processor_1 = require("../modules/packet_processor");
const sync_socket_1 = require("../sync_socket");
class Login {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
        this.name = name;
        this.socket = socket;
    }
    getPlayerByName() {
        return new Promise((res, rej) => {
            db_1.default.query("SELECT * FROM player WHERE name = ?", this.name, (err, row) => {
                if (err) {
                    this.output = { type: "err", body: "ERROR! Can't get player", name: this.name };
                    return rej(err);
                }
                if (row[0]) {
                    row[0].title = JSON.parse(row[0].title);
                    this.output = { type: "login", body: "", success: true, name: this.name };
                    res(JSON.parse(JSON.stringify(row[0])));
                }
                else {
                    res(null);
                }
            });
        });
    }
    createPlayerByName() {
        return new Promise((res, rej) => {
            db_1.default.query("INSERT INTO `player` (`name`) VALUES (?)", this.name, (err, row) => {
                if (err) {
                    this.output = { type: "err", body: "ERROR! Can't create player", name: this.name };
                    return rej(err);
                }
                this.output = { type: "login", body: "Welcome!", success: true, name: this.name };
                res({ id: row.insertId, name: this.name, feather: false, title: [] });
            });
        });
    }
    sendOutput(c = this.output) {
        console.log("send", c);
        this.socket.write((0, packet_processor_1.Packer)(c));
    }
    syncPlayer(player) {
        const output = { type: "sync", body: JSON.stringify(player), name: "3000", target: "player" };
        sync_socket_1.Main.write((0, packet_processor_1.Packer)(output));
    }
}
exports.Login = Login;
