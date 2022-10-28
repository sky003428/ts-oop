interface Output {
    error: boolean;
    message: string;
}

export default class Game {
    id: number;
    output: Output;
    win: boolean;
    gameOver: boolean;

    constructor() {
        this.id = 0;
        this.output = { error: false, message: "" };
        this.win = false;
        this.gameOver = false;
    }
}
// export default abstract class Game {
//     id: number;
//     output: Output;
//     win: boolean;
//     gameOver: boolean;

//     abstract guess(input:string):string;
// }
