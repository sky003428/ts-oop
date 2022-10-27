export default class Game {
    constructor() {
        this.id = 0;
        this.output = { error: false, win: false, message: "" };
        this.gameOver = false;
    }

    guess(input) {
        return this.output;
    }
}
