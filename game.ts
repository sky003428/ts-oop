interface Output {
    error: boolean;
    win: boolean;
    message: string;
}

export default class Game {
    id: number;
    output: Output;
    gameOver: boolean;

    constructor() {
        this.id = 0;
        this.output = { error: false, win: false, message: "" };
        this.gameOver = false;
    }

    public getDescription() {
        return { error: false, win: false, message: "" };
    }
}
