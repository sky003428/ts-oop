"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const login_server_1 = __importDefault(require("./login_server/login_server"));
const sync_socket_1 = require("./sync_socket");
const { HOST, PORT } = process.env;
login_server_1.default.listen({ host: HOST, port: PORT }, () => {
    console.log(`Login-Server start at ${HOST}:${PORT}`);
});
(0, sync_socket_1.StartSync)();
