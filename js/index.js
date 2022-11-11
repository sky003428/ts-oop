"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    console.log("client connected", socket.remotePort, "id");
    // todo: 紀錄clients,檢查重複登入, 踢掉前一位重複登入
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
                game.joinPlay(input.body, socket);
                game.canPlayed() && game.play();
            })();
        }
        // if (input.type == "login") {
        //     console.log(log);
        //     (async () => {
        //         await game.login(log.data.body);
        //         socket.write(JSON.stringify(game.getOutput()));
        //         log = await game.play(input.body);
        //         socket.write(JSON.stringify(game.getOutput()));
        //         if (log.err) {
        //             console.log(log.msg);
        //         }
        //     })();
        //     return;
        // }
        // if (input.type == "fight") {
        //     (async () => {
        //         const log: GameLog = await game.play(input.body);
        //         socket.write(JSON.stringify(game.getOutput()));
        //         if (log.err) {
        //             console.log(log.msg);
        //             return;
        //         }
        //     })();
        //     return;
        // }
    });
    // socket.on("disconnect", function () {
    //     delete clientList[clientId];
    // });
    socket.on("error", (err) => {
        console.log(socket.remotePort, "Abnormal disconnect");
        game.logOut(socket.remotePort);
    });
});
server.listen({ host: HOST, port: PORT }, () => {
    console.log(`Server start at ${HOST}:${PORT}`);
});
