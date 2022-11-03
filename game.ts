import { Player, P } from "./player";
import { Monster, M } from "./monster";

export default class Game {
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

    async login() {
        let playerData: P | undefined = await Player.getPlayerByName(this.input);

        if (!playerData) {
            playerData = await Player.createPlayerByName(this.input);
        }
        const { id, name, feather, title }: P = playerData;
        this.player = new Player(id, name, feather, title);

        this.output = `player${id} - ${this.input}登入 title:${title}`;
    }

    async play() {
        if (this.player.feather || this.player.title.includes("勇者")) {
            this.output = "You had killed phoenix";
            return;
        }
        await this.monster.init();
        const monsterData: M | undefined = this.monster.getData();

        if (!monsterData || monsterData?.hp <= 0) {
            this.output = "Monster already died";
            return;
        }
        let attackTimes: number = 0;
        let totalDamage: number = 0;

        while (monsterData.hp > 0) {
            const dmg: number = this.player.attack();
            ++attackTimes;
            totalDamage += dmg;

            this.monster.beAttack(dmg, this.player.name);

            // console.log(`造成 ${dmg}點傷害,鳳凰hp ${monsterData.hp}`);

            // monsterData = await this.monster.getMonsterData();
            if (monsterData.hp <= 0) {
                this.output = `Phoenix had been killed, Attack${attackTimes}times, ${totalDamage}damages`;
                if (monsterData.ks == this.player.name) {
                    this.output += ', Get "feather"';
                    this.player.updateFeather();
                    this.gameOver = true;

                    setTimeout(() => {
                        Monster.reborn();
                    }, 10000);
                }
            }
        }
    }

    display() {
        console.log(this.output);
    }

    isOver(): boolean {
        return this.gameOver;
    }
}
