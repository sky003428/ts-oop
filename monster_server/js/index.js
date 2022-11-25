"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const net_1 = __importDefault(require("net"));
const monster_1 = require("./monster");
const packet_processor_1 = require("./modules/packet_processor");
const rpc_type_1 = __importDefault(require("./modules/rpc_type"));
const { MAIN_PORT } = process.env;
let monster;
let tryTime = 1;
function startSync() {
    let main = net_1.default.createConnection({ host: "127.0.0.1", port: +MAIN_PORT }, async () => {
        console.log("Game-Server connected");
        // new Monster & get DB Data
        monster = await monster_1.Monster.init("鳳凰");
        monster.sync(main);
    });
    main.on("data", async (dataBuffer) => {
        const contents = (0, packet_processor_1.Parser)(dataBuffer);
        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            console.log("main:", c);
            if (c.type == rpc_type_1.default.Die) {
                monster.update(JSON.parse(c.body));
                continue;
            }
            if (c.type == rpc_type_1.default.Create) {
                await monster.createMonsterByName("鳳凰");
                monster.sync(main);
            }
        }
    });
    main.on("error", (err) => {
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
