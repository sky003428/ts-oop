"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./game"));
// const answer = (): string => {
//     // function
//     const pool: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     let a: string = "";
//     for (let i = 0; i < 4; ++i) {
//         const randIndex: number = Math.floor(Math.random() * (10 - i));
//         a += pool.splice(randIndex, 1)[0];
//     }
//     return a;
// };
class Game1a2b extends game_1.default {
    constructor() {
        super(...arguments);
        this.gameTimes = 10;
        this.answer = this.getAnswer();
    }
    getAnswer() {
        // function
        const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let a = "";
        for (let i = 0; i < 4; ++i) {
            const randIndex = Math.floor(Math.random() * (10 - i));
            a += pool.splice(randIndex, 1)[0];
        }
        return a;
    }
    isValid(i) {
        if (new Set(i).size !== 4) {
            this.output = "輸入長度錯誤或數字重複";
            return false;
        }
        else if (Array.from(i, Number).includes(NaN)) {
            this.output = "包含非法字元";
            return false;
        }
        this.input = i;
        return true;
    }
    guess() {
        let a = 0;
        let b = 0;
        --this.gameTimes;
        for (let i = 0; i < 4; ++i) {
            const compareIndex = this.answer.indexOf(this.input[i]);
            if (compareIndex >= 0) {
                if (compareIndex == i) {
                    ++a;
                }
                else {
                    ++b;
                }
            }
        }
        if (this.input == this.answer) {
            this.win = true;
            this.output = "答對了!";
            return;
        }
        this.output = `答錯了: ${a}A${b}B`;
        if (this.gameTimes < 1) {
            this.gameOver = true;
            this.output = `答錯了: ${a}A${b}B, 公布答案: ${this.answer}`;
            return;
        }
    }
    display() {
        console.log(this.output);
    }
    isOver() {
        return this.win || this.gameOver;
    }
}
exports.default = Game1a2b;
Game1a2b.id = 1; //static
Game1a2b.gameName = "1A2B";
const a = new Game1a2b();
