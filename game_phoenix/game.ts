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
            this.output = "輸入不符合格式";
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

        this.output = `玩家${id} - ${this.input}登入 稱號:${title}`;
    }

    async play() {
        if (this.player.feather || this.player.title.includes("勇者")) {
            this.output = "已經擊敗過鳳凰";
            return;
        }
        const data = await this.monster.init();
        const monsterData = this.monster.getData();

        if (monsterData.hp <= 0) {
            this.output = "怪物已死亡";
            return;
        }
        let attackTimes: number = 0;
        let totalDamage: number = 0;

        while (monsterData.hp > 0) {
            const dmg = this.player.attack();
            ++attackTimes;
            totalDamage += dmg;

            this.monster.beAttack(dmg, this.player.name);

            // console.log(`造成 ${dmg}點傷害,鳳凰hp ${monsterData.hp}`);

            // monsterData = await this.monster.getMonsterData();
            if (monsterData.hp <= 0) {
                this.output = `鳳凰被擊殺, 攻擊${attackTimes}次, 造成${totalDamage}傷害`;
                if (monsterData.ks == this.player.name) {
                    this.output += ', 你獲得 "羽毛"';
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
