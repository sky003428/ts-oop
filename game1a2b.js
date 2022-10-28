"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./game"));
const answer = () => {
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let a = "";
    for (let i = 0; i < 4; ++i) {
        const randIndex = Math.floor(Math.random() * (10 - i));
        a += pool.splice(randIndex, 1)[0];
    }
    return a;
};
class Game1a2b extends game_1.default {
    constructor() {
        super(...arguments);
        this.id = 1;
        this.name = "1A2B";
        this._gameTimes = 10;
        this._answer = answer();
    }
    guess(input) {
        let a = 0;
        let b = 0;
        if (new Set(input).size !== 4) {
            this.output = "輸入長度錯誤或數字重複";
            return;
        }
        else if (Array.from(input, Number).includes(NaN)) {
            this.output = "包含非法字元";
            return;
        }
        --this._gameTimes;
        for (let i = 0; i < 4; ++i) {
            const compareIndex = this._answer.indexOf(input[i]);
            if (compareIndex >= 0) {
                if (compareIndex == i) {
                    ++a;
                }
                else {
                    ++b;
                }
            }
        }
        if (input == this._answer) {
            this.win = true;
            this.output = "答對了!";
            return;
        }
        this.output = `答錯了: ${a}A${b}B`;
        if (this._gameTimes < 1) {
            this.gameOver = true;
            this.output = `答錯了: ${a}A${b}B, 公布答案: ${this._answer}`;
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
