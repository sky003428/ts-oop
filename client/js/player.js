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
Object.defineProperty(exports, "__esModule", { value: true });
const ReadLine = __importStar(require("readline/promises"));
const packet_processor_1 = require("./modules/packet_processor");
const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});
class Player {
    constructor() {
        this.isAttacking = false;
        this.isGameOver = false;
    }
    async login() {
        this.name = await rl.question("Enter Your Name:");
    }
    fight(client) {
        if (this.isGameOver) {
            clearInterval(this.attackTimer);
            this.isAttacking = false;
            return;
        }
        if (!this.isAttacking) {
            this.setTimer(client);
        }
    }
    setTimer(client) {
        this.isAttacking = true;
        this.attackTimer = setInterval(() => {
            const content = { type: "fight", body: "", name: this.name };
            client.write((0, packet_processor_1.Packer)(content));
        }, 10);
    }
    ask(body, client) {
        rl.question(body).then((input) => {
            const content = { type: "res", body: "", name: this.name };
            if (/^Y/im.test(input)) {
                content.body = "true";
            }
            else {
                content.body = "false";
            }
            client.write((0, packet_processor_1.Packer)(content));
        });
    }
}
exports.default = Player;
