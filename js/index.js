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
const ReadLine = __importStar(require("readline/promises"));
const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let client;
let name;
(async () => {
    const input = await rl.question("Enter Your Name:");
    client = net_1.default.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
        client.setNoDelay(true);
        const req = { type: "login", body: input };
        name = input;
        client.write(JSON.stringify(req));
    });
    client.on("connect", function () {
        console.log("已經與伺服器端建立連接");
    });
    client.on("data", function (data) {
        let d;
        try {
            d = JSON.parse(data.toString());
        }
        catch (err) {
            console.log(data.toString(), err);
            return;
        }
        if (d.type == "msg" || d.type == "err") {
            console.log(`${d.type}: ${d.body}`);
            return;
        }
        if (d.type == "req") {
            rl.question(`${d.body}`).then((input) => {
                client.write(JSON.stringify({ type: "res", body: input, name }));
            });
            return;
        }
        if (d.type == "fightLog") {
            console.log(d.body);
            if (!d.isGameOver) {
                client.write(JSON.stringify({ type: "fight", body: name }));
                return;
            }
        }
    });
    client.on("close", function (data) {
        console.log("Connect close");
    });
    client.on("error", (err) => {
        console.log(err);
    });
})();
