import Game from "./game";

const maxNumber: number = 100;
const answer: number = Math.ceil(Math.random() * maxNumber);

export default class Game_guess extends Game {
    name: string;
    answer: number;
    rangeMin: number;
    rangeMax: number;

    constructor() {
        super();
        this.name = "終極密碼";
        this.id = 2;
        this.answer = answer;
        this.rangeMin = 1;
        this.rangeMax = maxNumber;
    }

    guess(input: string): void {
        const inputNumber: number = +input;
        if (isNaN(inputNumber) || !Number.isInteger(inputNumber)) {
            this.output.error = true;
            this.output.message = "輸入非整數";
            return;
        } else if (inputNumber < this.rangeMin || inputNumber > this.rangeMax) {
            this.output.error = true;
            this.output.message = "數字不在範圍內";
            return;
        }

        if (inputNumber === this.answer) {
            this.win = true;
            this.output.message = "答對了!";
        } else if (this.answer > inputNumber) {
            this.output.message = `${inputNumber + 1} ~ ${this.rangeMax}`;
            this.rangeMin = inputNumber + 1;
        } else {
            this.output.message = `從${this.rangeMin} ~ ${inputNumber - 1}`;
            this.rangeMax = inputNumber - 1;
        }
    }
}
