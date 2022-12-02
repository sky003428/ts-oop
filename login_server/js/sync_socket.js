"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = exports.StartSync = void 0;
const net_1 = __importDefault(require("net"));
const { MAIN_PORT } = process.env;
let tryTime = 1;
function StartSync() {
    exports.Main = net_1.default.createConnection({ host: "127.0.0.1", port: +MAIN_PORT }, () => {
        console.log("Game-Server connected");
    });
    exports.Main.on("error", (err) => {
        console.log(err);
        console.log(`Try reconnect in 5 secs... (${tryTime})`);
        setTimeout(() => {
            ++tryTime;
            StartSync();
            return;
        }, 5000);
    });
}
exports.StartSync = StartSync;
