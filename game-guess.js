import Game from "./game.js";

const maxNumber = 100;
const answer = Math.ceil(Math.random() * maxNumber);

export default class Game_guess extends Game {
    constructor() {
        super();
        this.name = "終極密碼";
        this.id = 2;
        this.answer = answer;
        this.rangeMin = 1;
        this.rangeMax = maxNumber;
    }

    guess(input) {
        const inputNumber = +input;
        if (isNaN(inputNumber) || !Number.isInteger(inputNumber)) {
            this.output.error = true;
            this.output.message = "輸入非整數";
            return this.output;
        } else if (inputNumber < this.rangeMin || inputNumber > this.rangeMax) {
            this.output.error = true;
            this.output.message = "數字不在範圍內";
            return this.output;
        }

        if (inputNumber === this.answer) {
            this.output.win = true;
            this.output.message = "答對了!";
        } else if (this.answer > inputNumber) {
            this.output.message = `${inputNumber + 1} ~ ${this.rangeMax}`;
            this.rangeMin = inputNumber + 1;
        } else {
            this.output.message = `從${this.rangeMin} ~ ${inputNumber - 1}`;
            this.rangeMax = inputNumber - 1;
        }
        return this.output;
    }
}
