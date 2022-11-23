"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const server_1 = __importDefault(require("./game_server/server"));
const sync_socket_1 = __importDefault(require("./sync_socket"));
const { HOST, PORT } = process.env;
server_1.default.listen({ host: HOST, port: PORT }, () => {
    console.log(`Game-Server start at ${HOST}:${PORT}`);
});
sync_socket_1.default.listen({ host: HOST, port: 888 }, () => {
    console.log(`Sync start at ${HOST}:888`);
});
