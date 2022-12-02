import Net from "net";
import { game } from "./game_server/game";
import Monster from "./game_server/monster";
import { Parser } from "./modules/packet_processor";
import RpcType from "./modules/rpc_type";

const SyncSocket: Net.Server = Net.createServer((socket: Net.Socket): void => {
    console.log("Server", socket.remotePort, "on");

    socket.on("data", async (dataBuffer: Buffer): Promise<void> => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c: Content = contents[i];
            console.log("sync:", c);

            if (c.target == "player") {
                game.syncPlayer(JSON.parse(c.body));
                continue;
            }
            if (c.target == "monster" && c.type == RpcType.Sync) {
                game.syncMonster(JSON.parse(c.body));
                Monster.socket = socket;
                continue;
            }
            if (c.target == "monster" && c.type == RpcType.AttackLog) {
                game.handleAttackLog(c);
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
