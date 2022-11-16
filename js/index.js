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
    socket.on("data", (dataBuffer) => {
        // console.log(dataBuffer.toString());
        const dataArr = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);
        dataArr.forEach((d) => {
            let log = game.isValid(d.toString(), socket);
            if (log.err) {
                return;
            }
            const input = log.data;
            // server同步
            if (input.type == "fetch") {
                game.slaverServer.set(input.name, socket);
                const res = {
                    type: "sync",
                    body: "",
                    target: "",
                    name: input.name,
                };
                if (input.target == "monster") {
                    res.target = "monster";
                    res.name = JSON.stringify(game.monster.getData());
                }
                else if (input.target == "player") {
                    (async () => {
                        res.target = "player";
                        await game.login(input.name, socket, true);
                        res.name = JSON.stringify(game.players.get(input.name));
                    })();
                }
                socket.write(JSON.stringify(res));
            }
            if (input.type == "login") {
                (async () => {
                    log = await game.login(input.name, socket);
                    if (log.err) {
                        return;
                    }
                    game.play(input.name, socket);
                })();
            }
            if (input.type == "res") {
                const pattarn = /^Y/im;
                const answer = pattarn.test(input.body);
                if (!answer) {
                    socket.end(JSON.stringify({ type: "msg", body: "bye", name: input.name }));
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
                game.play(input.name, socket);
                return;
            }
            if (input.type == "logout") {
                game.logOutByName(input.name);
                return;
            }
        });
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
