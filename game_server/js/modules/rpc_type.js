"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RpcType;
(function (RpcType) {
    RpcType["Message"] = "msg";
    RpcType["Fight"] = "fight";
    RpcType["FightLog"] = "fightLog";
    RpcType["Request"] = "req";
    RpcType["Response"] = "res";
    RpcType["Error"] = "err";
    RpcType["Sync"] = "sync";
    // Monster
    RpcType["BeAttack"] = "beAtk";
    RpcType["AttackLog"] = "aatackLog";
    RpcType["Create"] = "create";
    // Login
    RpcType["Login"] = "login";
})(RpcType || (RpcType = {}));
exports.default = RpcType;
