import Net from "net";
import Player from "./player";
import { Packer, Parser } from "./modules/packet_processor";

enum Server {
    login = 3000,
    main = 3001,
}

let port: number = Server.login;
const player: Player = new Player();

async function start(): Promise<void> {
    console.log("start", port);
    if (port == Server.login) {
        await player.login();
    }

    let client: Net.Socket = Net.createConnection({ host: "127.0.0.1", port }, () => {
        const content: Content = { type: "login", body: "", name: player.name };
        if (port == Server.login) {
            console.log("login");
            client.write(Packer(content));
            return;
        }

        content.type = "fight";
        client.write(Packer(content));
    });

    client.on("connect", () => {
        console.log("已經與伺服器端建立連接");
    });

    client.on("data", (dataBuffer: Buffer) => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c: Content = contents[i];
            const showType: string[] = ["msg", "err", "fightLog"];
            showType.includes(c.type) && console.log(c.body);

            if (c.type == "login" && c.success) {
                port = Server.main;
                client.destroy();

                start();
                return;
            }

            if (c.type == "fightLog") {
                player.isGameOver = c.isGameOver;
                player.fight(client);
                continue;
            }

            if (c.type == "req") {
                player.ask(c.body, client);
            }
        }
    });

    client.on("close", () => {
        console.log("Connection close");
    });

    client.on("error", (err) => {
        console.log(err);
    });
}

start();
