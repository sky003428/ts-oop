"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = exports.startSync = void 0;
const net_1 = __importDefault(require("net"));
const monster_1 = require("./monster");
const packet_processor_1 = require("./modules/packet_processor");
const rpc_type_1 = __importDefault(require("./modules/rpc_type"));
let tryTime = 1;
function startSync(host, port) {
    let monster;
    exports.Main = net_1.default.createConnection({ host, port }, async () => {
        console.log("Game-Server connected");
        // new Monster & get DB Data
        monster = await monster_1.Monster.init("鳳凰");
        monster.sync();
    });
    exports.Main.on("data", async (dataBuffer) => {
        const contents = (0, packet_processor_1.Parser)(dataBuffer);
        for (let i = 0; i < contents.length; ++i) {
            const c = contents[i];
            if (c.type == rpc_type_1.default.BeAttack) {
                monster.beAttack(+c.body, c.name);
                continue;
            }
            if (c.type == rpc_type_1.default.Create) {
                await monster.createMonsterByName("鳳凰");
                monster.sync();
            }
        }
    });
    exports.Main.on("error", (err) => {
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
exports.startSync = startSync;
