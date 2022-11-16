"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monster = void 0;
class Monster {
    constructor(name) {
        this.name = name;
        this.name = name;
    }
    static fetch(master, name) {
        master.write(JSON.stringify({ type: "fetch", body: "", name, target: "monster" }));
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
    }
    beAttack(dmg) {
        this.data.hp -= dmg;
        console.log(this.data.hp);
    }
}
exports.Monster = Monster;
