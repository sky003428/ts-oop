"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const net_1 = __importDefault(require("net"));
const game_1 = require("./game");
const monster_1 = require("./monster");
const { HOST, PORT2 } = process.env;
const game = new game_1.Game();
const master = net_1.default.createConnection({ host: HOST, port: 3000 }, () => {
    console.log("Master connected", master.remotePort);
    monster_1.Monster.fetch(master, PORT2);
    master.on("data", (dataBuffer) => {
        const dataArr = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);
        try {
            const dArr = dataArr.map((d) => JSON.parse(d));
            console.log("master: ", dataBuffer.toString());
            for (let d of dArr) {
                if (d.type == "sync" && d.target == "monster") {
                    game.monster.setData(JSON.parse(d.body));
                    return;
                }
                const socket = game.players.get(d.name);
                socket.write(JSON.stringify(d));
            }
        }
        catch (err) {
            console.log(dataArr, "Decode error", err);
            return;
        }
    });
});
const server = net_1.default.createServer((socket) => {
    socket.setNoDelay(true);
    console.log("client connected", socket.remotePort, "id");
    socket.on("data", (dataBuffer) => {
        console.log("get", dataBuffer.toString());
        const dataArr = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);
        dataArr.forEach((d) => {
            let log = game.isValid(d, socket);
            if (log.err) {
                return;
            }
            const input = log.data;
            if (input.type == "login") {
                master.write(JSON.stringify(input));
                // master.write(JSON.stringify({ type: "fetch", body: "", name: input.name, target: "player" }));
                game.login(input.name, socket);
                return;
            }
            if (input.type == "fight") {
                game.canPlay(input.name, socket) && master.write(JSON.stringify(input));
                return;
            }
            if (input.type == "res") {
                if (/^Y/im.test(input.body)) {
                    master.write(JSON.stringify(input));
                }
                else {
                    master.write(JSON.stringify({ type: "logout", body: "", name: input.name }));
                    game.logOut(socket.remotePort);
                    socket.end(JSON.stringify({ type: "msg", body: "bye", name: input.name }));
                }
            }
        });
    });
    socket.on("error", () => {
        console.log(socket.remotePort, "Abnormal disconnect");
        const name = game.logOut(socket.remotePort);
        master.write(JSON.stringify({ type: "logout", body: "", name }));
    });
    socket.on("close", () => {
        console.log(socket.remotePort, "has disconnected");
        const name = game.logOut(socket.remotePort);
        name && master.write(JSON.stringify({ type: "logout", body: "", name }));
    });
});
server.listen({ host: HOST, port: PORT2 }, () => {
    console.log(`Server start at ${HOST}:${PORT2}`);
});
