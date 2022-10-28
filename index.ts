import * as readline from "readline";
import Game_1a2b from "./game-1a2b";
import Game_guess from "./game-guess";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let gid = 0;

const question = () => {
    return new Promise<void>((resolve, reject) => {
        rl.question("遊戲選擇\n1-1a2b \n2-終極密碼\n:", (input: string) => {
            gid = +input;
            resolve();
        });
    });
};

const play = () => {
    return new Promise<void>((resolve, reject) => {
        let g: any;
        switch (gid) {
            case 1:
                g = new Game_1a2b();
                break;
            case 2:
                g = new Game_guess();
                break;
            default:
                rl.close();
                resolve();
        }

        console.log(`答案是:${g.answer}`);
        console.log(`遊戲"${g.name}",請輸入:`);

        rl.on("line", (input) => {
            g.guess(input);
            console.log(g.output.message);

            if (g.win || g.gameOver) {
                rl.close();
                resolve();
            }
        });
    });
};

rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
});

const start = async () => {
    await question();
    await play();
};

start();
