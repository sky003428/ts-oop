import * as readline from "readline";
import Game from "./game";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const start = (): void => {
    const g = new Game();
    rl.question("請輸入暱稱: ", (input: string): void => {
        (async function () {
            if (!g.isValid(input)) {
                g.display();
                start();
                return;
            }
            await g.login();
            g.display();
            await g.play();
            g.display();
            
            if (g.isOver()) {
                rl.close();
            }
        })();
    });
};

rl.on("close", (): void => {
    console.log("Goodbye!");
    // process.exit(0);
});

start();
