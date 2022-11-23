import Net from "net";
import { Parser, Packer } from "../modules/packet_processor";
import { game } from "./game";

const Server: Net.Server = Net.createServer((socket: Net.Socket): void => {
    console.log("client connected", socket.remotePort, "id");
    const welcomeMsg: Content = {
        type: "msg",
        body: `Welcome to <Phoenix> ,monster hp:${game.monster.data.hp}`,
        name: "main",
    };
    socket.write(Packer(welcomeMsg));

    socket.on("data", async (dataBuffer: Buffer): Promise<void> => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c: Content = contents[i];
            // 驗證是否登入
            if (!game.isLogged(c.name, socket)) {
                return;
            }
            // 嘗試攻擊怪物
            if (c.type == "fight") {
                game.fight(c.name, socket);
            }
            // 等待怪物復活回應
            if (c.type == "res") {
                game.response(c.name, socket, c.body);
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
