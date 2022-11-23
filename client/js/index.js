"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const player_1 = __importDefault(require("./player"));
const packet_processor_1 = require("./modules/packet_processor");
var Server;
(function (Server) {
    Server[Server["login"] = 3000] = "login";
    Server[Server["main"] = 3001] = "main";
})(Server || (Server = {}));
let port = Server.login;
const player = new player_1.default();
async function start() {
    console.log("start", port);
    if (port == Server.login) {
        await player.login();
    }
    let client = net_1.default.createConnection({ host: "127.0.0.1", port }, () => {
        const content = { type: "login", body: "", name: player.name };
        if (port == Server.login) {
            console.log("login");
            client.write((0, packet_processor_1.Packer)(content));
            return;
        }
        content.type = "fight";
        client.write((0, packet_processor_1.Packer)(content));
    });
    client.on("connect", () => {
        console.log("已經與伺服器端建立連接");
    });
    client.on("data", (dataBuffer) => {
        const contents = (0, packet_processor_1.Parser)(dataBuffer);
        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            const showType = ["msg", "err", "fightLog"];
            showType.includes(c.type) && console.log(c.body);
            if (c.type == "login" && c.success) {
                port = Server.main;
                client.destroy();
                start();
                return;
            }
            if (c.type == "fightLog") {
                player.isGameOver = c.isGameOver;
                player.fight(client);
                continue;
            }
            if (c.type == "req") {
                player.ask(c.body, client);
            }
        }
    });
    client.on("close", () => {
        console.log("Connection close");
    });
    client.on("error", (err) => {
        console.log(err);
    });
}
start();
