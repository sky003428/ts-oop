import Net from "net";
import { Login } from "./login";
import { Parser } from "../modules/packet_processor";

const LoginServer: Net.Server = Net.createServer((socket: Net.Socket): void => {
    console.log("client connected", socket.remotePort, "id");

    socket.on("data", async (dataBuffer: Buffer): Promise<void> => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            const loginPlayer = new Login(c.name, socket);
            let player: P;

            try {
                player = await loginPlayer.getPlayerByName();
                if (!player) {
                    player = await loginPlayer.createPlayerByName();
                }
            } catch (error) {
                console.log(error);
                loginPlayer.sendOutput();
                continue;
            }

            loginPlayer.syncPlayer(player);
            loginPlayer.sendOutput();
        }
    });

    socket.on("error", () => {
        console.log(socket.remotePort, "Abnormal disconnect");
    });

    socket.on("close", () => {
        console.log(socket.remotePort, "has disconnected");
    });
});

export default LoginServer;
