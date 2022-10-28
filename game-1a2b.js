"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./game"));
const answer_1a2b_1 = __importDefault(require("./answer-1a2b"));
class Game_1a2b extends game_1.default {
    constructor() {
        super();
        this.name = "1A2B";
        this.id = 1;
        this.answer = (0, answer_1a2b_1.default)();
        this.gameTimes = 10;
    }
    guess(input) {
        let a = 0;
        let b = 0;
        if (new Set(input).size !== 4) {
            this.output.error = true;
            this.output.message = "輸入長度錯誤或數字重複";
            return;
        }
        else if (Array.from(input, Number).includes(NaN)) {
            this.output.error = true;
            this.output.message = "包含非法字元";
            return;
        }
        --this.gameTimes;
        for (let i = 0; i < 4; ++i) {
            const compareIndex = this.answer.indexOf(input[i]);
            if (compareIndex >= 0) {
                if (compareIndex == i) {
                    ++a;
                }
                else {
                    ++b;
                }
            }
        }
        if (input == this.answer) {
            this.win = true;
            this.output.message = "答對了!";
            return;
        }
        this.output.message = `答錯了: ${a}A${b}B`;
        if (this.gameTimes < 1) {
            this.gameOver = true;
            this.output.message = `答錯了: ${a}A${b}B, 公布答案: ${this.answer}`;
            return;
        }
    }
}
exports.default = Game_1a2b;
