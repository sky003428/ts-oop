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
const ReadLine = __importStar(require("readline-sync"));
const game_1 = require("./game");
const start = () => {
    const g = new game_1.Game();
    const input = ReadLine.question("Enter your name: ");
    if (!g.isValid(input)) {
        g.display();
        start();
        return;
    }
    (async () => {
        let resError = false;
        resError = await g.login();
        g.display();
        if (resError) {
            start();
            return;
        }
        resError = await g.play();
        g.display();
        if (resError) {
            start();
            return;
        }
        if (g.isOver()) {
            close();
        }
    })();
};
function close() {
    console.log("Goodbye!");
    // process.exit(0);
}
start();
