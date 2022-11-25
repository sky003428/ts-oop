"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packet_processor_1 = require("../modules/packet_processor");
const rpc_type_1 = __importDefault(require("../modules/rpc_type"));
class Monster {
    constructor(name) {
        this.data = { id: 0, name: "鳳凰", hp: 0, ks: "" };
        this.isRespawn = false;
        this.name = name;
    }
    beAttack(dmg) {
        this.data.hp -= dmg;
    }
    getData() {
        return this.data;
    }
    setData(data) {
        const isRespawnSnap = this.isRespawn;
        this.isRespawn = true;
        this.data = data;
        return isRespawnSnap;
    }
    monsterKilledBy(ksPlayer) {
        console.log(`<Phoenix> has died, kill by ${ksPlayer}`);
        this.data.ks = ksPlayer;
        const die = { type: rpc_type_1.default.Die, body: JSON.stringify(this.data), target: "monster", name: "3001" };
        console.log("send:", die);
        Monster.socket.write((0, packet_processor_1.Packer)(die));
    }
    static create(monsterName, delay = 15) {
        setTimeout(() => {
            const create = { type: rpc_type_1.default.Create, body: monsterName, target: "monster", name: "3001" };
            console.log("send:", create);
            Monster.socket.write((0, packet_processor_1.Packer)(create));
        }, 1000 * delay);
    }
}
exports.default = Monster;
