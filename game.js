"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor() {
        this.id = 0;
        this.output = { error: false, message: "" };
        this.win = false;
        this.gameOver = false;
    }
}
exports.default = Game;
// export default abstract class Game {
//     id: number;
//     output: Output;
//     win: boolean;
//     gameOver: boolean;
//     abstract guess(input:string):string;
// }
