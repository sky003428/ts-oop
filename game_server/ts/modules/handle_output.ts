import RpcType from "./rpc_type";
import { Err, Message, FightLog, Request } from "./rpc_detail";

type Attacking = (dmg: number, total: number, time: number) => Content;
type AttackOver = (total: number, time: number) => Content;

type OutputType = {
    [RpcType.Error]: { [detail in Err]: Content };
    [RpcType.Message]: { [detail in Message]: Content };
    [RpcType.FightLog]: { [detail in FightLog]?: Content };
    [RpcType.Request]: { [detail in Request]: Content };
    [FightLog.Attacking]: Attacking;
    [FightLog.AttackOver]: AttackOver;
    [FightLog.KillSteal]: AttackOver;
};

export default function Output(name: string): OutputType {
    return {
        [RpcType.Error]: {
            login: { type: RpcType.Error, body: "Error, You haven't logged", name },
            repeatLog: {
                type: RpcType.Error,
                body: "this player has been login on another device",
                name: name,
            },
        },
        [RpcType.Request]: {
            waitMonster: {
                type: RpcType.Request,
                body: `Waitng for next Phoenix? (y/n)`,
                name,
            },
        },
        [RpcType.Message]: {
            waiting: { type: RpcType.Message, body: "Waiting for Phoenix respawn...", name },
            bye: {
                type: RpcType.Request,
                body: `Waitng for next Phoenix? (y/n)`,
                name,
            },
        },
        [RpcType.FightLog]: {
            alreadyKill: {
                type: RpcType.FightLog,
                body: "You've already kill the Phoenix",
                name,
                isGameOver: true,
            },
            alreadyDied: {
                type: RpcType.FightLog,
                body: "Monster has already died",
                name,
                isGameOver: true,
            },
        },
        attacking: function (dmg: number, total: number, time: number): Content {
            return {
                type: RpcType.FightLog,
                body: `You attack Phoenix ${dmg} damage - total: ${total} (${time})`,
                name,
                isGameOver: false,
            };
        },
        attackOver: function (total: number, time: number): Content {
            return {
                type: RpcType.FightLog,
                body: `You Kill Phoenix, TotalDamage: ${total} - ${time} times, Get "Feather"`,
                name,
                isGameOver: true,
            };
        },
        killSteal: function (total: number, time: number): Content {
            return {
                type: RpcType.FightLog,
                body: `You Kill Phoenix, TotalDamage: ${total} - ${time} times, Get "Feather"`,
                name,
                isGameOver: true,
            };
        },
    };
}
