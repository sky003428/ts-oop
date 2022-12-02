"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const game_1 = require("./game_server/game");
const monster_1 = __importDefault(require("./game_server/monster"));
const packet_processor_1 = require("./modules/packet_processor");
const rpc_type_1 = __importDefault(require("./modules/rpc_type"));
const SyncSocket = net_1.default.createServer((socket) => {
    console.log("Server", socket.remotePort, "on");
    socket.on("data", async (dataBuffer) => {
        const contents = (0, packet_processor_1.Parser)(dataBuffer);
        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            console.log("sync:", c);
            if (c.target == "player") {
                game_1.game.syncPlayer(JSON.parse(c.body));
                continue;
            }
            if (c.target == "monster" && c.type == rpc_type_1.default.Sync) {
                game_1.game.syncMonster(JSON.parse(c.body));
                monster_1.default.socket = socket;
                continue;
            }
            if (c.target == "monster" && c.type == rpc_type_1.default.AttackLog) {
                game_1.game.handleAttackLog(c);
            }
        }
    });
    socket.on("error", () => {
        console.log(socket.remotePort, "Server error");
    });
    socket.on("close", () => {
        console.log(socket.remotePort, "Server down");
    });
});
exports.default = SyncSocket;
