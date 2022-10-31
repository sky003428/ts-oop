"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./game"));
const maxNumber = 100;
const answer = Math.ceil(Math.random() * maxNumber);
class GameGuess extends game_1.default {
    constructor() {
        super(...arguments);
        this.id = 2;
        this.name = "終極密碼";
        this._answer = answer;
        this._rangeMin = 1;
        this._rangeMax = maxNumber;
    }
    isValid(i) {
        if (isNaN(+i) || !Number.isInteger(+i)) {
            this.output = "輸入非整數";
            return false;
        }
        else if (+i < this._rangeMin || +i > this._rangeMax) {
            this.output = "數字不在範圍內";
            return false;
        }
        this.input = i;
        return true;
    }
    guess() {
        const inputNumber = +this.input;
        if (inputNumber === this._answer) {
            this.win = true;
            this.output = "答對了!";
        }
        else if (this._answer > inputNumber) {
            this.output = `${inputNumber + 1} ~ ${this._rangeMax}`;
            this._rangeMin = inputNumber + 1;
        }
        else {
            this.output = `從${this._rangeMin} ~ ${inputNumber - 1}`;
            this._rangeMax = inputNumber - 1;
        }
    }
    display() {
        console.log(this.output);
    }
    isOver() {
        return this.win;
    }
}
exports.default = GameGuess;
