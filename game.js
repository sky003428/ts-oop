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
        this.input = "";
        this.output = "";
        this.win = false;
        this.gameOver = false;
    }
}
exports.default = Game;
