import Net from "net";
import * as ReadLine from "readline/promises";
import { Packer } from "./modules/packet_processor";

const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export default class Player {
    public name: string;
    public isAttacking: boolean = false;
    public isGameOver: boolean = false;
    public attackTimer: NodeJS.Timer;

    public async login(): Promise<void> {
        this.name = await rl.question("Enter Your Name:");
    }

    public fight(client: Net.Socket): void {
        if (this.isGameOver) {
            clearInterval(this.attackTimer);
            this.isAttacking = false;
            return;
        }
        if (!this.isAttacking) {
            this.setTimer(client);
        }
    }

    public setTimer(client: Net.Socket): void {
        this.isAttacking = true;
        this.attackTimer = setInterval(() => {
            const content: Content = { type: "fight", body: "", name: this.name };
            client.write(Packer(content));
        }, 10);
    }

    public ask(body: string, client: Net.Socket): void {
        rl.question(body).then((input: string) => {
            const content: Content = { type: "res", body: "", name: this.name };

            if (/^Y/im.test(input)) {
                content.body = "true";
            } else {
                content.body = "false";
            }

            client.write(Packer(content));
        });
    }
}
