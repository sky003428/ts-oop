import Game from "./game";

const answer = (): string => {
    const pool: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let a: string = "";

    for (let i = 0; i < 4; ++i) {
        const randIndex: number = Math.floor(Math.random() * (10 - i));
        a += pool.splice(randIndex, 1)[0];
    }

    return a;
};

export default class Game1a2b extends Game {
    readonly id: number = 1;
    readonly name: string = "1A2B";
    private _gameTimes: number = 10;
    private _answer: string = answer();

    guess(input: string): void {
        let a = 0;
        let b = 0;

        if (new Set(input).size !== 4) {
            this.output = "輸入長度錯誤或數字重複";
            return;
        } else if (Array.from(input, Number).includes(NaN)) {
            this.output = "包含非法字元";
            return;
        }

        --this._gameTimes;
        for (let i = 0; i < 4; ++i) {
            const compareIndex = this._answer.indexOf(input[i]);
            if (compareIndex >= 0) {
                if (compareIndex == i) {
                    ++a;
                } else {
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

    display(): void {
        console.log(this.output);
    }

    isOver(): boolean {
        return this.win || this.gameOver;
    }
}