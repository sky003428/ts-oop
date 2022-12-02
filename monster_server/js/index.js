"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sync_socket_1 = require("./sync_socket");
const { MAIN_PORT } = process.env;
(0, sync_socket_1.startSync)("127.0.0.1", +MAIN_PORT);
