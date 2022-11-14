import "dotenv/config";
import Net from "net";
import { Game, GameLog, R } from "./game";

const { HOST, PORT } = process.env;
const game: Game = new Game();

(async () => {
    const log: GameLog = await game.start();
    if (log.err) {
        return;
    }
})();

const server: Net.Server = Net.createServer((socket: Net.Socket): void => {
    socket.setNoDelay(true);
    console.log("client connected", socket.remotePort, "id");

    socket.on("data", (data: Buffer): void => {
        console.log(data.toString());

        let log: GameLog = game.isValid(data.toString(), socket);
        if (log.err) {
            return;
        }

        const input = log.data;

        if (input.type == "fetch") {
            // const output:R ={type:"post",body:game.monster.getData()}
            switch(input.body){
                case "monster"
            }
            return;
        }
        if (input.type == "login") {
            (async () => {
                log = await game.login(input.body, socket);
                if (log.err) {
                    return;
                }
                game.play(input.body, socket);
            })();
        }
        if (input.type == "res") {
            const pattarn = /^Y/im;
            const answer: boolean = pattarn.test(input.body);

            if (!answer) {
                socket.end(JSON.stringify({ type: "msg", body: "bye" }));
                return;
            }

            if (game.monster.getData().hp > 0) {
                game.play(input.name, socket);
            } else {
                game.playingPlayers.set(input.name, game.players.get(input.name));
            }
        }
        if (input.type == "fight") {
            game.play(input.body, socket);
        }
    });

    socket.on("error", () => {
        console.log(socket.remotePort, "Abnormal disconnect");
        game.logOut(socket.remotePort);
    });

    socket.on("close", () => {
        console.log(socket.remotePort, "has disconnected");
        game.logOut(socket.remotePort);
    });
});

server.listen({ host: HOST, port: PORT }, () => {
    console.log(`Server start at ${HOST}:${PORT}`);
});
