import Net from "net";
import RpcType from "../modules/rpc_type";
import { Parser, Packer } from "../modules/packet_processor";
import { game } from "./game";

const Server: Net.Server = Net.createServer((socket: Net.Socket): void => {
    console.log("client connected", socket.remotePort, "id");
    const welcomeMsg: Content = {
        type: RpcType.Message,
        body: `Welcome to <Phoenix> ,monster hp:${game.monster.getData().hp}`,
        name: "main",
    };
    socket.write(Packer(welcomeMsg));

    socket.on("data", async (dataBuffer: Buffer): Promise<void> => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c: Content = contents[i];
            // 驗證是否登入
            if (!game.isLogged(c.name, socket)) {
                continue;
            }
            // 嘗試攻擊怪物
            if (c.type == RpcType.Fight) {
                game.enterAttackQueue(c.name, socket);
                // game.fight(c.name, socket);
                continue;
            }
            // 等待怪物復活回應
            if (c.type == RpcType.Response) {
                game.response(c.name, socket, c.body);
                continue;
            }
        }
    });

    socket.on("error", () => {
        console.log("error", socket.remotePort);
    });

    socket.on("close", () => {
        game.logout(socket.remotePort);
    });
});

export default Server;
