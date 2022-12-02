"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.FightLog = exports.Message = exports.Err = void 0;
var Err;
(function (Err) {
    Err["Login"] = "login";
    Err["RepeatLog"] = "repeatLog";
})(Err = exports.Err || (exports.Err = {}));
var Message;
(function (Message) {
    Message["Waiting"] = "waiting";
    Message["Bye"] = "bye";
})(Message = exports.Message || (exports.Message = {}));
var FightLog;
(function (FightLog) {
    FightLog["AlreadyKill"] = "alreadyKill";
    FightLog["AlreadyDied"] = "alreadyDied";
    FightLog["Attacking"] = "attacking";
    FightLog["AttackOver"] = "attackOver";
    FightLog["KillSteal"] = "killSteal";
})(FightLog = exports.FightLog || (exports.FightLog = {}));
var Request;
(function (Request) {
    Request["WaitMonster"] = "waitMonster";
})(Request = exports.Request || (exports.Request = {}));
