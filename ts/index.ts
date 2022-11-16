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

    socket.on("data", (dataBuffer: Buffer): void => {
        // console.log(dataBuffer.toString());

        const dataArr: string[] = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);
        dataArr.forEach((d) => {
            let log: GameLog = game.isValid(d.toString(), socket);
            if (log.err) {
                return;
            }

            const input = log.data;

            // server同步
            if (input.type == "fetch") {
                game.slaverServer.set(input.name, socket);
                const res: R = {
                    type: "sync",
                    body: "",
                    target: "",
                    name: input.name,
                };

                if (input.target == "monster") {
                    res.target = "monster";
                    res.name = JSON.stringify(game.monster.getData());
                } else if (input.target == "player") {
                    (async () => {
                        res.target = "player";
                        await game.login(input.name, socket, true);
                        res.name = JSON.stringify(game.players.get(input.name));
                    })();
                }
                socket.write(JSON.stringify(res));
            }

            if (input.type == "login") {
                (async () => {
                    log = await game.login(input.name, socket);
                    if (log.err) {
                        return;
                    }
                    game.play(input.name, socket);
                })();
            }
            if (input.type == "res") {
                const pattarn = /^Y/im;
                const answer: boolean = pattarn.test(input.body);

                if (!answer) {
                    socket.end(JSON.stringify({ type: "msg", body: "bye", name: input.name }));
                    return;
                }

                if (game.monster.getData().hp > 0) {
                    game.play(input.name, socket);
                } else {
                    game.playingPlayers.set(input.name, game.players.get(input.name));
                }
            }
            if (input.type == "fight") {
                game.play(input.name, socket);
                return;
            }
            if (input.type == "logout") {
                game.logOutByName(input.name);
                return;
            }
        });
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
