import * as readline from "readline";
import Game1a2b from "./game1a2b";
import GameGuess from "./gameGuess";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

enum GameId {
    Game1a2b = 1,
    GameGuess = 2,
}

const gameSelect = (id: number): any => {
    switch (id) {
        case GameId.Game1a2b:
            return new Game1a2b();
        case GameId.GameGuess:
            return new GameGuess();
        default:
            return false;
    }
};

const start = (): void => {
    rl.question("遊戲選擇\n1-1a2b \n2-終極密碼:", (input: string): void => {
        let g = gameSelect(+input);
        if (!g) {
            console.log("無此遊戲\n");
            start();
            return;
        }

        console.log(`請作答:`);
        rl.on("line", (input: string): void => {
            if (g.isValid(input)) {
                g.guess();
            }
            g.display();
            g.input = "1";

            if (g.isOver()) {
                rl.close();
            }
        });
    });
};

rl.on("close", (): void => {
    console.log("Goodbye!");
    process.exit(0);
});

// stash
start();
