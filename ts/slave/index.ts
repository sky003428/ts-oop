import "dotenv/config";
import Net from "net";
import { Game, GameLog, R } from "./game";
import { Monster } from "./monster";

const { HOST, PORT } = process.env;
const game: Game = new Game();

const master: Net.Socket = Net.createConnection({ host: HOST, port: 3000 }, () => {
    console.log("Master connected", master.remotePort);
    Monster.fetch(master, PORT);

    master.on("data", (dataBuffer: Buffer) => {
        const dataArr: string[] = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);
        try {
            const dArr: R[] = dataArr.map((d: string) => JSON.parse(d));
            console.log("master: ", dataBuffer.toString());

            for (let d of dArr) {
                if (d.type == "sync" && d.target == "monster") {
                    game.monster.setData(JSON.parse(d.body));
                    return;
                }

                const socket: Net.Socket = game.players.get(d.name);
                socket.write(JSON.stringify(d));
            }
        } catch (err) {
            console.log(dataArr, "Decode error", err);
            return;
        }
    });
});

const server: Net.Server = Net.createServer((socket: Net.Socket): void => {
    socket.setNoDelay(true);
    console.log("client connected", socket.remotePort, "id");

    socket.on("data", (dataBuffer: Buffer): void => {
        console.log("get", dataBuffer.toString());
        const dataArr: string[] = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);

        dataArr.forEach((d) => {
            let log: GameLog = game.isValid(d, socket);
            if (log.err) {
                return;
            }

            const input = log.data;

            if (input.type == "login") {
                master.write(JSON.stringify(input));
                // master.write(JSON.stringify({ type: "fetch", body: "", name: input.name, target: "player" }));
                game.login(input.name, socket);
                return;
            }
            if (input.type == "fight") {
                game.canPlay(input.name, socket) && master.write(JSON.stringify(input));
                return;
            }
            if (input.type == "res") {
                if (/^Y/im.test(input.body)) {
                    master.write(JSON.stringify(input));
                } else {
                    master.write(JSON.stringify({ type: "logout", body: "", name: input.name }));
                    game.logOut(socket.remotePort);
                    socket.end(JSON.stringify({ type: "msg", body: "bye", name: input.name }));
                }
            }
        });
    });

    socket.on("error", () => {
        console.log(socket.remotePort, "Abnormal disconnect");
        const name = game.logOut(socket.remotePort);
        master.write(JSON.stringify({ type: "logout", body: "", name }));
    });

    socket.on("close", () => {
        console.log(socket.remotePort, "has disconnected");
        const name = game.logOut(socket.remotePort);
        name && master.write(JSON.stringify({ type: "logout", body: "", name }));
    });
});

server.listen({ host: HOST, port: PORT }, () => {
    console.log(`Server start at ${HOST}:${PORT}`);
});
