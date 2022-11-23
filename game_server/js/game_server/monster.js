"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_processor_1 = require("../modules/packet_processor");
class Monster {
    constructor(name) {
        this.name = name;
        this.data = { id: 0, name: "鳳凰", hp: 0, ks: "" };
        this.isRespawn = false;
        this.name = name;
    }
    beAttack(dmg) {
        this.data.hp -= dmg;
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
        const die = { type: "die", body: JSON.stringify(this.data), target: "monster", name: "3001" };
        console.log("send:", die);
        this.socket.write((0, packet_processor_1.Packer)(die));
    }
    static create(monsterName, socket, delay = 15) {
        setTimeout(() => {
            const create = { type: "create", body: monsterName, target: "monster", name: "3001" };
            console.log("send:", create);
            socket.write((0, packet_processor_1.Packer)(create));
        }, 1000 * delay);
    }
}
exports.default = Monster;
