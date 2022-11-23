"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const login_1 = require("./login");
const packet_processor_1 = require("../modules/packet_processor");
const Server = net_1.default.createServer((socket) => {
    console.log("client connected", socket.remotePort, "id");
    socket.on("data", async (dataBuffer) => {
        const contents = (0, packet_processor_1.Parser)(dataBuffer);
        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            const loginPlayer = new login_1.Login(c.name, socket);
            let player;
            try {
                player = await loginPlayer.getPlayerByName();
                if (!player) {
                    player = await loginPlayer.createPlayerByName();
                }
            }
            catch (error) {
                console.log(error);
                loginPlayer.sendOutput();
                continue;
            }
            loginPlayer.syncPlayer(player);
            loginPlayer.sendOutput();
        }
    });
    socket.on("error", () => {
        console.log(socket.remotePort, "Abnormal disconnect");
    });
    socket.on("close", () => {
        console.log(socket.remotePort, "has disconnected");
    });
});
exports.default = Server;
