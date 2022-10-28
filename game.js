"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor() {
        this.id = 0;
        this.output = { error: false, win: false, message: "" };
        this.gameOver = false;
    }
    getDescription() {
        return { error: false, win: false, message: "" };
    }
}
exports.default = Game;
