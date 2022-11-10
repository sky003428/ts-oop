import { Monster } from "./monster";
import { Player, P } from "./player";

export interface GameLog {
    err: boolean;
    msg: string;
    data?: R;
}

export interface R {
    type: string;
    body: string;
    isGameOver?: boolean;
}

export class Game {
    public monster: Monster = new Monster("鳳凰");
    public players = new Map<string, Player>();
    private output: R;
    private log: GameLog = { err: false, msg: "" };

    public isValid(i: string): GameLog {
        let data: R;
        this.log = { err: false, msg: "" };
        // parse
        try {
            data = JSON.parse(i);
        } catch (error) {
            this.log.err = true;
            this.log.msg = error;
            return this.log;
        }

        // 判斷有沒有key type,body 型別
        if (!(typeof data.type == "string") || !(typeof data.body == "string")) {
            this.output = { type: "err", body: "Incorrect input" };
            return { err: true, msg: "Incorrect resquest" };
        }

        return { ...this.log, data };
    }

    public async login(loginName: string): Promise<GameLog> {
        this.log = { err: false, msg: "" };
        let playerData: P;

        try {
            playerData = await Player.getPlayerByName(loginName);
        } catch (err) {
            this.log.err = true;
            this.log.msg = "ERROR! Server can't get player\n" + err;
            return this.log;
        }

        if (!playerData) {
            try {
                playerData = await Player.createPlayerByName(loginName);
            } catch (err) {
                this.log.err = true;
                this.log.msg = "ERROR! Server can't create player\n" + err;
                return this.log;
            }
        }

        const { id, name, feather, title } = playerData;
        this.players.set(name, new Player(id, name, feather, title));

        this.output = { type: "msg", body: `player${id} - ${name}登入 title:${title}` };
        if (this.monster.getData().id) {
            this.output.body += `Phoenix hp:${this.monster.getData().hp}`;
        }
        console.log(this.players);
    }

    public async start(): Promise<GameLog> {
        this.log = { err: false, msg: "" };
        try {
            this.monster.setData(await this.monster.init());
        } catch (err) {
            this.log.err = true;
            this.log.msg = "ERROR! Server Can't init monster\n" + err;
            return this.log;
        }

        return this.log;
    }

    public async play(name: string): Promise<GameLog> {
        this.log = { err: false, msg: "" };

        if (this.monster.getData().hp < 0) {
            this.output = { type: "msg", body: "Monster was already died!" };
            return this.log;
        }
        const player = this.players.get(name);
        if (player.isGameOver()) {
            this.output = { type: "msg", body: "You've already kill monster!" };
            return this.log;
        }

        const dmg: number = player.attack();
        this.monster.beAttack(dmg);
        this.output = {
            type: "fightLog",
            body: `玩家${name} 造成${dmg}傷害 攻擊${player.attackTimes}次 總傷害${player.totalDamage}`,
            isGameOver: false,
        };
        console.log(name, this.monster.getData().hp);

        if (this.monster.getData().hp <= 0) {
            this.output = {
                type: "fightLog",
                body: `Phoenix had been killed,${player.name} Attack:${player.attackTimes} times - ${player.totalDamage} damages`,
                isGameOver: true,
            };
            console.log(
                `Phoenix had been killed,${player.name} Attack:${player.attackTimes} times - ${player.totalDamage} damages`
            );
            try {
                await this.monster.monsterDie(player.name);
            } catch (err) {
                this.log.err = true;
                this.log.msg = "Error! Server can't mod monster";
                return this.log;
            }
            console.log("20秒後重生");
            setTimeout(() => {
                Monster.respawn()
                    .then((data) => {
                        this.monster.setData(data);
                    })
                    .catch((err) => {
                        console.log("Error!Server can't respawn monster\n" + err);
                    });
            }, 1000 * 20);
        }

        if (this.monster.getData().ks == player.name) {
            this.output.body += ', Get "feather"';

            await player.updateFeather().catch((err) => {
                console.log("Error!Server can't updateFeather\n" + err);
            });
        }

        return this.log;
    }

    public getOutput(): R {
        return this.output;
    }
}
