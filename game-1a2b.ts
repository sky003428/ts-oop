import Game from "./game";
import answer from "./answer-1a2b";

export default class Game_1a2b extends Game {
    name: string;
    answer: string;
    gameTimes: number;

    constructor() {
        super();
        this.name = "1A2B";
        this.id = 1;
        this.answer = answer();
        this.gameTimes = 10;
    }

    guess(input: string) {
        let a = 0;
        let b = 0;

        if (new Set(input).size !== 4) {
            this.output.error = true;
            this.output.message = "輸入長度錯誤或數字重複";
            return;
        } else if (Array.from(input, Number).includes(NaN)) {
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
                } else {
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
