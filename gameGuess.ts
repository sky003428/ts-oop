import Game from "./game";

const maxNumber: number = 100;
const answer: number = Math.ceil(Math.random() * maxNumber);

export default class GameGuess extends Game {
    public static readonly id = 2;
    public static readonly gameName: string = "終極密碼";
    private answer: number = answer; //no底線
    private rangeMin: number = 1;
    private rangeMax = maxNumber;

    isValid(i: string): boolean {
        if (isNaN(+i) || !Number.isInteger(+i)) {
            this.output = "輸入非整數";
            return false;
        } else if (+i < this.rangeMin || +i > this.rangeMax) {
            this.output = "數字不在範圍內";
            return false;
        }
        this.input = i;
        return true;
    }
    guess(): void {
        const inputNumber: number = +this.input;

        if (inputNumber === this.answer) {
            this.win = true;
            this.output = "答對了!";
        } else if (this.answer > inputNumber) {
            this.output = `${inputNumber + 1} ~ ${this.rangeMax}`;
            this.rangeMin = inputNumber + 1;
        } else {
            this.output = `從${this.rangeMin} ~ ${inputNumber - 1}`;
            this.rangeMax = inputNumber - 1;
        }
    }
    display(): void {
        console.log(this.output);
    }

    isOver(): boolean {
        return this.win;
    }
}
