import "dotenv/config";
import Net from "net";
import { Monster } from "./monster";
import { Parser } from "./modules/packet_processor";
import RpcType from "./modules/rpc_type";

const { MAIN_PORT } = process.env;
let monster: Monster;
let tryTime = 1;

function startSync() {
    let main: Net.Socket = Net.createConnection({ host: "127.0.0.1", port: +MAIN_PORT }, async () => {
        console.log("Game-Server connected");
        // new Monster & get DB Data
        monster = await Monster.init("鳳凰");
        monster.sync(main);
    });

    main.on("data", async (dataBuffer: Buffer) => {
        const contents: Content[] = Parser(dataBuffer);

        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            console.log("main:", c);

            if (c.type == RpcType.Die) {
                monster.update(JSON.parse(c.body));
                continue;
            }
            if (c.type == RpcType.Create) {
                await monster.createMonsterByName("鳳凰");
                monster.sync(main);
            }
        }
    });

    main.on("error", (err: Error) => {
        console.log(err);
        if (/ECONNREFUSED/g.test(err.message)) {
            console.log(`Try reconnect in 5 secs... (${tryTime})`);
            setTimeout(() => {
                ++tryTime;
                startSync();
                return;
            }, 5000);
        }
    });
}

startSync();
