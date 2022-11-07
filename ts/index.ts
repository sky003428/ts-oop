import * as ReadLine from "readline-sync";
import { Game } from "./game";

const start = (): void => {
    const g: Game = new Game();
    const input = ReadLine.question("Enter your name: ");

    if (!g.isValid(input)) {
        g.display();
        start();
        return;
    }

    (async () => {
        let resError = false;
        resError = await g.login();
        g.display();
        if (resError) {
            start();
            return;
        }

        resError = await g.play();
        g.display();
        if (resError) {
            start();
            return;
        }

        if (g.isOver()) {
            close();
        }
    })();
};

function close() {
    console.log("Goodbye !");
    // process.exit(0);
}

start();
