import Net from "net";
import { Monster } from "./monster";
import { Parser } from "./modules/packet_processor";
import RpcType from "./modules/rpc_type";
let tryTime = 1;

export function startSync(host: string, port: number) {
    let monster: Monster;

    Main = Net.createConnection({ host, port }, async () => {
        console.log("Game-Server connected");
        // new Monster & get DB Data
        monster = await Monster.init("鳳凰");
        monster.sync();
    });

    Main.on("data", async (dataBuffer: Buffer) => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];

            if (c.type == RpcType.BeAttack) {
                monster.beAttack(+c.body, c.name);
                continue;
            }

            if (c.type == RpcType.Create) {
                await monster.createMonsterByName("鳳凰");
                monster.sync();
            }
        }
    });

    Main.on("error", (err: Error) => {
        console.log(err);
        console.log(`Try reconnect in 5 secs... (${tryTime})`);
        // Restart
        setTimeout(() => {
            ++tryTime;
            startSync(host, port);
            return;
        }, 5000);
    });
}

export let Main: Net.Socket;
