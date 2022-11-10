import "dotenv/config";
import Net from "net";
import { Game, GameLog, R } from "./game";

const { HOST, PORT } = process.env;
const clientList: Net.Socket[] = [];
const game: Game = new Game();

(async () => {
    const gl: GameLog = await game.start();
    gl.err && console.log(gl.msg);
    console.log(`怪物 ${game.monster.getData().name},血量:${game.monster.getData().hp} \n`);
})();

const server: Net.Server = Net.createServer((socket: Net.Socket): void => {
    console.log("client connected", socket.remotePort, "id");
    // todo: 紀錄clients,檢查重複登入, 踢掉前一位重複登入

    socket.on("data", function (data: Buffer) {
        console.log(data.toString());

        let log: GameLog = game.isValid(data.toString());
        if (log.err) {
            socket.write(JSON.stringify(game.getOutput()));
            console.log(log.msg);
            return;
        }
        const input = log.data;

        if (input.type == "login") {
            console.log(log);
            (async () => {
                await game.login(log.data.body);
                socket.write(JSON.stringify(game.getOutput()));

                log = await game.play(input.body);
                socket.write(JSON.stringify(game.getOutput()));
                if (log.err) {
                    console.log(log.msg);
                }
            })();
            return;
        }
        if (input.type == "fight") {
            (async () => {
                const log: GameLog = await game.play(input.body);

                socket.write(JSON.stringify(game.getOutput()));
                if (log.err) {
                    console.log(log.msg);
                    return;
                }
            })();
            return;
        }
    });

    // socket.on("disconnect", function () {
    //     delete clientList[clientId];
    // });

    socket.on("error", (err) => {
        console.log(socket.remotePort, "用戶異常斷線");
    });
});

server.listen({ host: HOST, port: PORT }, () => {
    console.log(`Server start at ${HOST}:${PORT}`);
});
