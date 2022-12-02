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
    beAttack(dmg, name) {
        // this.data.hp -= dmg;
        const c = { type: rpc_type_1.default.BeAttack, body: dmg.toString(), target: "monster", name };
        Monster.socket.write((0, packet_processor_1.Packer)(c));
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
}
exports.default = Monster;
