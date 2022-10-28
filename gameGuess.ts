import Game from "./game";

const maxNumber: number = 100;
const answer: number = Math.ceil(Math.random() * maxNumber);

export default class GameGuess extends Game {
    readonly id = 2;
    readonly name: string = "終極密碼";
    private _answer: number = answer;
    private _rangeMin:number = 1;
    private _rangeMax = maxNumber;

    guess(input: string): void {
        const inputNumber: number = +input;
        if (isNaN(inputNumber) || !Number.isInteger(inputNumber)) {
            this.output = "輸入非整數";
            return;
        } else if (inputNumber < this._rangeMin || inputNumber > this._rangeMax) {
            this.output = "數字不在範圍內";
            return;
        }

        if (inputNumber === this._answer) {
            this.win = true;
            this.output = "答對了!";
        } else if (this._answer > inputNumber) {
            this.output = `${inputNumber + 1} ~ ${this._rangeMax}`;
            this._rangeMin = inputNumber + 1;
        } else {
            this.output = `從${this._rangeMin} ~ ${inputNumber - 1}`;
            this._rangeMax = inputNumber - 1;
        }
    }
    display(): void {
        console.log(this.output);
    }

    isOver(): boolean {
        return this.win;
    }
}