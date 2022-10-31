export default abstract class Game {
    public static readonly id: number;
    public static readonly gameName: string;
    protected input: string = "";
    protected output: string = "";
    protected win: boolean = false;
    protected gameOver: boolean = false;

    abstract isValid(input: string): boolean;
    abstract guess(): void;
    abstract display(): void;
    abstract isOver(): boolean;
}
