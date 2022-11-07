import { Player, P } from "./player";
import { Monster, M } from "./monster";

export class Game {
    private input: string = "";
    private output: string = "";
    private player: Player;
    private monster: Monster = new Monster("鳳凰");
    private gameOver: boolean = false;

    isValid(i: string): boolean {
        if (typeof i !== "string" || i.length > 255 || i.trim().length < 1) {
            this.output = "Incorrect input";
            return false;
        }

        this.input = i.trim();
        return true;
    }

    async login(): Promise<boolean> {
        let playerData: P;

        try {
            playerData = await Player.getPlayerByName(this.input);
        } catch (err) {
            this.output = "Error! Sever can't get player data\n" + err;
            return true;
        }

        if (!playerData) {
            try {
                playerData = await Player.createPlayerByName(this.input);
            } catch (err) {
                this.output = "Error! Server can't create player\n" + err;
                return true;
            }
        }

        const { id, name, feather, title } = playerData;
        this.player = new Player(id, name, feather, title);

        this.output = `player${id} - ${this.input}登入 title:${title}`;
    }

    async play(): Promise<boolean> {
        if (this.player.feather || this.player.title.includes("勇者")) {
            this.output = "You had killed phoenix";
            return true;
        }

        try {
            this.monster.setData(await this.monster.init());
        } catch (err) {
            this.output = "Error! Server Can't init monster\n" + err;
            return true;
        }

        if (!this.monster.getData() || this.monster.getData()?.hp <= 0) {
            this.output = "Monster already died";
            return;
        }

        let attackTimes: number = 0;
        let totalDamage: number = 0;

        while (this.monster.getData().hp > 0) {
            const dmg: number = this.player.attack();
            ++attackTimes;
            totalDamage += dmg;

            this.monster.beAttack(dmg);

            if (this.monster.getData().hp <= 0) {
                try {
                    await this.monster.monsterDie(this.player.name);
                } catch (err) {
                    this.output = "Error! Server can't mod monster" + err;
                    return true;
                }

                this.output = `Phoenix had been killed, Attack:${attackTimes} times - ${totalDamage} damages`;
                setTimeout(() => {
                    Monster.respawn().catch((err) => {
                        console.log("Error!Server can't respawn monster\n" + err);
                    });
                }, 1000 * 5);
            }

            if (this.monster.getData().ks == this.player.name) {
                this.output += ', Get "feather"';

                await this.player.updateFeather().catch((err) => {
                    console.log("Error!Server can't updateFeather\n" + err);
                });

                this.gameOver = true;
            }
        }
    }

    display(): void {
        console.log(this.output);
    }

    isOver(): boolean {
        return this.gameOver;
    }
}
