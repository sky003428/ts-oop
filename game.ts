// export default class Game {
//     id: number;
//     output: Output;
//     win: boolean;
//     gameOver: boolean;

//     constructor() {
//         this.id = 0;
//         this.output = { error: false, message: "" };
//         this.win = false;
//         this.gameOver = false;
//     }
// }

export default abstract class Game {
    abstract readonly id: number;
    abstract readonly name: string;
    protected input: string = "";
    protected output: string = "";
    protected win: boolean = false;
    protected gameOver: boolean = false;

    abstract isValid(input: string): boolean;
    abstract guess(): void;
    abstract display(): void;
    abstract isOver(): boolean;
}
