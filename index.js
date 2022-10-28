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
const readline = __importStar(require("readline"));
const game_1a2b_1 = __importDefault(require("./game-1a2b"));
const game_guess_1 = __importDefault(require("./game-guess"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let gid = 0;
const question = () => {
    return new Promise((resolve, reject) => {
        rl.question("遊戲選擇\n1-1a2b \n2-終極密碼\n:", (input) => {
            gid = +input;
            resolve();
        });
    });
};
const play = () => {
    return new Promise((resolve, reject) => {
        let g;
        switch (gid) {
            case 1:
                g = new game_1a2b_1.default();
                break;
            case 2:
                g = new game_guess_1.default();
                break;
            default:
                rl.close();
                resolve();
        }
        console.log(`答案是:${g.answer}`);
        console.log(`遊戲"${g.name}",請輸入:`);
        rl.on("line", (input) => {
            g.guess(input);
            console.log(g.output.message);
            if (g.win || g.gameOver) {
                rl.close();
                resolve();
            }
        });
    });
};
rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
});
const start = async () => {
    await question();
    await play();
};
start();
