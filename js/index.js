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
var ServerList;
(function (ServerList) {
    ServerList["master"] = "1";
    ServerList["slave"] = "2";
})(ServerList || (ServerList = {}));
let client;
let atkTimer;
let attacking = false;
(async () => {
    const name = await rl.question("Enter Your Name:");
    const portSelect = await rl.question("Select Server: \n1. Master\n2. Slave\n");
    let port;
    switch (portSelect) {
        case ServerList.master:
            port = 3000;
            break;
        case ServerList.slave:
            port = 3001;
            break;
        default:
            process.exit(1);
    }
    client = net_1.default.createConnection({ host: "127.0.0.1", port }, () => {
        client.setNoDelay(true);
        const req = { type: "login", body: "", name };
        client.write(JSON.stringify(req));
    });
    client.on("connect", function () {
        console.log("已經與伺服器端建立連接");
    });
    client.on("data", function (dataBuffer) {
        const dataArr = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);
        let dArr;
        try {
            dArr = dataArr.map((d) => JSON.parse(d));
        }
        catch (err) {
            console.log(dataArr, err);
            return;
        }
        dArr.forEach((d) => {
            if (d.type == "msg" || d.type == "err") {
                console.log(`${d.type}: ${d.body}`);
                return;
            }
            if (d.type == "req") {
                if (d.isGameOver) {
                    clearInterval(atkTimer);
                    attacking = false;
                }
                rl.question(`${d.type} : ${d.body}`).then((input) => {
                    client.write(JSON.stringify({ type: "res", body: input, name }));
                });
                return;
            }
            if (d.type == "fightLog") {
                console.log(`${d.type} : ${d.body},${d.isGameOver}`);
                if (d.isGameOver) {
                    clearInterval(atkTimer);
                    attacking = false;
                }
                if (!d.isGameOver && !attacking) {
                    atkTimer = setInterval(() => {
                        attacking = true;
                        client.write(JSON.stringify({ type: "fight", body: "", name }));
                    }, 10);
                }
            }
        });
    });
    client.on("close", function (data) {
        console.log("Connect close");
    });
    client.on("error", (err) => {
        console.log(err);
    });
})();
