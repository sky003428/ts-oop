"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_type_1 = __importDefault(require("./rpc_type"));
const rpc_detail_1 = require("./rpc_detail");
function Output(name) {
    return {
        [rpc_type_1.default.Error]: {
            login: { type: rpc_type_1.default.Error, body: "Error, You haven't logged", name },
            repeatLog: {
                type: rpc_type_1.default.Error,
                body: "this player has been login on another device",
                name: name,
            },
        },
        [rpc_type_1.default.Request]: {
            waitMonster: {
                type: rpc_type_1.default.Request,
                body: `Waitng for next Phoenix? (y/n)`,
                name,
            },
        },
        [rpc_type_1.default.Message]: {
            waiting: { type: rpc_type_1.default.Message, body: "Waiting for Phoenix respawn...", name },
            bye: {
                type: rpc_type_1.default.Request,
                body: `Waitng for next Phoenix? (y/n)`,
                name,
            },
        },
        [rpc_type_1.default.FightLog]: {
            alreadyKill: {
                type: rpc_type_1.default.FightLog,
                body: "You've already kill the Phoenix",
                name,
                isGameOver: true,
            },
            alreadyDied: {
                type: rpc_type_1.default.FightLog,
                body: "Monster has already died",
                name,
                isGameOver: true,
            },
        },
        attacking: function (dmg, total, time) {
            return {
                type: rpc_type_1.default.FightLog,
                body: `You attack Phoenix ${dmg} damage - total: ${total} (${time})`,
                name,
                isGameOver: false,
            };
        },
        attackOver: function (total, time) {
            return {
                type: rpc_type_1.default.FightLog,
                body: `You Kill Phoenix, TotalDamage: ${total} - ${time} times, Get "Feather"`,
                name,
                isGameOver: true,
            };
        },
        killSteal: function (total, time) {
            return {
                type: rpc_type_1.default.FightLog,
                body: `You Kill Phoenix, TotalDamage: ${total} - ${time} times, Get "Feather"`,
                name,
                isGameOver: true,
            };
        },
    };
}
exports.default = Output;
