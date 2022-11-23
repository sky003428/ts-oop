import Net from "net";
import { Packer } from "../modules/packet_processor";
import Monster from "./monster";
import Player from "./player";

export class Game {
    public players = new Map<string, Player>();
    public playingPlayers = new Map<string, Player>();
    public monster: Monster = new Monster("鳳凰");
    // 驗證是否登入
    public isLogged(name: string, socket: Net.Socket): boolean {
        if (!this.players.get(name)) {
            const c: Content = { type: "err", body: "Error, You haven't logged", name };
            this.sendOutput(socket, c);
            return false;
        }
        this.players.get(name).socket = socket;
        return true;
    }

    public async fight(name: string, socket: Net.Socket): Promise<void> {
        const player = this.players.get(name);
        // 判斷是否擊殺過
        if (player.feather || player.title.includes("勇者")) {
            this.sendOutput(socket, {
                type: "fightLog",
                body: "You've already kill the Phoenix",
                name,
                isGameOver: true,
            });
            return;
        }
        // 判斷怪物是否存活
        if (this.monster.data.hp <= 0) {
            // 如果已發送遊戲結束訊息給玩家, 不再發送怪物死亡訊息
            if (player.overSended) {
                return;
            }
            this.sendOutput(socket, { type: "fightLog", body: "Monster has already died", name, isGameOver: true });
            this.sendOutput(socket, {
                type: "req",
                body: `Waitng for next Phoenix? (y/n)`,
                name,
            });

            return;
        }

        // 玩家進入戰鬥
        this.playingPlayers.set(name, player);
        const dmg = player.attack(this.monster.data.hp);
        this.monster.beAttack(dmg);

        // 傳回本次攻擊結果
        this.sendOutput(socket, {
            type: "fightLog",
            body: `You attack Phoenix ${dmg} damage - total: ${player.totalDamage}`,
            name,
            isGameOver: false,
        });
        // 怪物死亡處理
        if (this.monster.data.hp <= 0) {
            this.gameOverTransmit(name);
            this.playingPlayers.clear();

            this.monster.monsterKilledBy(name);
            Monster.create("鳳凰", this.monster.socket);
        }
    }
    // 處理怪物死亡後的廣播, 及ks玩家拿到羽毛
    public gameOverTransmit(ksPlayer: string) {
        this.playingPlayers.forEach((p: Player) => {
            if (p.name == ksPlayer) {
                p.getFeather();

                this.sendOutput(p.socket, {
                    type: "fightLog",
                    body: `You Kill Phoenix, TotalDamage: ${p.totalDamage} - ${p.attacktime} times, Get "Feather"`,
                    name: p.name,
                    isGameOver: true,
                });
            } else {
                this.sendOutput(p.socket, {
                    type: "fightLog",
                    body: `Phoenix died, TotalDamage: ${p.totalDamage} - ${p.attacktime} times`,
                    name: p.name,
                    isGameOver: true,
                });
                this.sendOutput(p.socket, {
                    type: "req",
                    body: `Waitng for next Phoenix? (y/n)`,
                    name: p.name,
                });
            }

            p.overSended = true;
            p.initialFightLog();
        });
    }

    // 處理玩家回應
    public response(name: string, socket: Net.Socket, body: string) {
        const player = this.players.get(name);
        // valid
        if (player.feather || player.title.includes("勇者")) {
            const c: Content = { type: "fightLog", body: "You've already kill the Phoenix", name };
            this.sendOutput(socket, c);
            return;
        }

        if (body == "false") {
            const c: Content = { type: "msg", body: "bye", name };
            socket.end(Packer(c));
        }

        // 怪還在等待復活
        if (body == "true" && this.monster.data.hp <= 0) {
            this.playingPlayers.set(name, player);

            const c: Content = { type: "msg", body: "Waiting for Phoenix respawn...", name };
            this.sendOutput(socket, c);
        }
        // 怪已復活
        if (body == "true" && this.monster.data.hp > 0) {
            this.fight(name, socket);
        }
    }
    // 處理回覆玩家
    public sendOutput(socket: Net.Socket, content: Content): void {
        socket.write(Packer(content));
    }

    // 從Login Server同步玩家登入資料
    public syncPlayer(player: P) {
        const { id, name, feather, title } = player;
        const playerSnap = game.players.get(name);
        if (playerSnap) {
            const c: Content = {
                type: "err",
                body: "this player has been login on another device",
                name: name,
            };
            playerSnap.socket.end(Packer(c));
        }

        game.players.set(name, new Player(id, name, feather, title));
    }
    //  從Monster Server同步怪物資料
    public syncMonster(monsterData: M) {
        const isRespawn: boolean = game.monster.setData(monsterData);
        if (isRespawn) {
            this.playingPlayers.forEach((p: Player) => {
                this.fight(p.name, p.socket);
            });
        }
    }

    public logout(port: number): void {
        for (let [name, player] of this.players) {
            if (port == player.socket.remotePort) {
                this.players.delete(name);
                this.playingPlayers.delete(name);
                console.log(`Player: ${name} has disconnected`);

                break;
            }
        }
    }
}

export const game = new Game();
