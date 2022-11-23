import Net from "net";
import { game } from "./game_server/game";
import { Parser } from "./modules/packet_processor";

const SyncSocket: Net.Server = Net.createServer((socket: Net.Socket): void => {
    console.log("Server", socket.remotePort, "on");

    socket.on("data", async (dataBuffer: Buffer): Promise<void> => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c: Content = contents[i];
            console.log("sync:", c);

            if (c.target == "player") {
                game.syncPlayer(JSON.parse(c.body));
            }
            if (c.target == "monster") {
                game.syncMonster(JSON.parse(c.body));
                game.monster.socket = socket;
            }
        }
    });

    socket.on("error", () => {
        console.log(socket.remotePort, "Server error");
    });

    socket.on("close", () => {
        console.log(socket.remotePort, "Server down");
    });
});

export default SyncSocket;
