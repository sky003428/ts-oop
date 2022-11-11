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
    // todo: 紀錄clients,檢查重複登入, 踢掉前一位重複登入

    socket.on("data", (data: Buffer): void => {
        console.log(data.toString());

        let log: GameLog = game.isValid(data.toString(), socket);
        if (log.err) {
            return;
        }

        const input = log.data;

        if (input.type == "login") {
            (async () => {
                log = await game.login(input.body, socket);
                if (log.err) {
                    return;
                }
                game.joinPlay(input.body, socket);
                game.canPlayed() && game.play();
            })();
        }
        if (input.type == "res") {
            // input.name
            const pattarn = /^Y/im;
            const answer: boolean = pattarn.test(input.body);

            if (!answer) {
                socket.end(JSON.stringify({ type: "msg", body: "bye" }));
                return;
            }

            game.playingPlayers.push(input.name);
            game.canPlayed() && game.play();
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
