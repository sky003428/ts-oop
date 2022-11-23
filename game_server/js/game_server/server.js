"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const packet_processor_1 = require("../modules/packet_processor");
const game_1 = require("./game");
const Server = net_1.default.createServer((socket) => {
    console.log("client connected", socket.remotePort, "id");
    const welcomeMsg = {
        type: "msg",
        body: `Welcome to <Phoenix> ,monster hp:${game_1.game.monster.data.hp}`,
        name: "main",
    };
    socket.write((0, packet_processor_1.Packer)(welcomeMsg));
    socket.on("data", async (dataBuffer) => {
        const contents = (0, packet_processor_1.Parser)(dataBuffer);
        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            // 驗證是否登入
            if (!game_1.game.isLogged(c.name, socket)) {
                return;
            }
            // 嘗試攻擊怪物
            if (c.type == "fight") {
                game_1.game.fight(c.name, socket);
            }
            // 等待怪物復活回應
            if (c.type == "res") {
                game_1.game.response(c.name, socket, c.body);
            }
        }
    });
    socket.on("error", () => {
        console.log("error", socket.remotePort);
    });
    socket.on("close", () => {
        game_1.game.logout(socket.remotePort);
    });
});
exports.default = Server;
