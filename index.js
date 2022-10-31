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
const game1a2b_1 = __importDefault(require("./game1a2b"));
const gameGuess_1 = __importDefault(require("./gameGuess"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var GameId;
(function (GameId) {
    GameId[GameId["Game1a2b"] = 1] = "Game1a2b";
    GameId[GameId["GameGuess"] = 2] = "GameGuess";
})(GameId || (GameId = {}));
function gameSelect(id) {
    switch (id) {
        case GameId.Game1a2b:
            return new game1a2b_1.default();
        case GameId.GameGuess:
            return new gameGuess_1.default();
        default:
            return undefined;
    }
}
const start = () => {
    rl.question("遊戲選擇\n1-1a2b \n2-終極密碼:", (input) => {
        let g = gameSelect(+input);
        if (g === undefined) {
            console.log("無此遊戲\n");
            start();
            return;
        }
        console.log(`請作答:`);
        rl.on("line", (input) => {
            if (g.isValid(input)) {
                g.guess();
            }
            g.display();
            if (g.isOver()) {
                rl.close();
            }
        });
    });
};
rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
});
// stash
start();
