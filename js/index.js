"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const net_1 = __importDefault(require("net"));
const game_1 = require("./game");
const { HOST, PORT } = process.env;
const game = new game_1.Game();
(async () => {
    const log = await game.start();
    if (log.err) {
        return;
    }
})();
const server = net_1.default.createServer((socket) => {
    socket.setNoDelay(true);
    console.log("client connected", socket.remotePort, "id");
    socket.on("data", (data) => {
        console.log(data.toString());
        let log = game.isValid(data.toString(), socket);
        if (log.err) {
            return;
        }
        const input = log.data;
        if (input.type == "login") {
            (async () => {
                log = await game.login(input.body, socket);
                if (log.err) {
                    return;
                }
                game.play(input.body, socket);
            })();
        }
        if (input.type == "res") {
            const pattarn = /^Y/im;
            const answer = pattarn.test(input.body);
            if (!answer) {
                socket.end(JSON.stringify({ type: "msg", body: "bye" }));
                return;
            }
            if (game.monster.getData().hp > 0) {
                game.play(input.name, socket);
            }
            else {
                game.playingPlayers.set(input.name, game.players.get(input.name));
            }
        }
        if (input.type == "fight") {
            game.play(input.body, socket);
        }
    });
    socket.on("error", () => {
        console.log(socket.remotePort, "Abnormal disconnect");
        game.logOut(socket.remotePort);
    });
    socket.on("close", () => {
        console.log(socket.remotePort, "has disconnected");
        game.logOut(socket.remotePort);
    });
});
server.listen({ host: HOST, port: PORT }, () => {
    console.log(`Server start at ${HOST}:${PORT}`);
});
