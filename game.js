"use strict";
// export default class Game {
//     id: number;
//     output: Output;
//     win: boolean;
//     gameOver: boolean;
Object.defineProperty(exports, "__esModule", { value: true });
//     constructor() {
//         this.id = 0;
//         this.output = { error: false, message: "" };
//         this.win = false;
//         this.gameOver = false;
//     }
// }
class Game {
    constructor() {
        this.output = "";
        this.win = false;
        this.gameOver = false;
        // abstract valid(): void;
        // abstract display(): void;
        // abstract isOver(): boolean;
    }
}
exports.default = Game;
