import Net from "net";
import * as ReadLine from "readline/promises";

const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

interface R {
    type: string;
    body: string;
    name: string;
    isGameOver?: boolean;
}

enum ServerList {
    master = "1",
    slave = "2",
}

let client: Net.Socket;
let atkTimer: NodeJS.Timer;
let attacking: boolean = false;

(async () => {
    const name: string = await rl.question("Enter Your Name:");
    const portSelect: string = await rl.question("Select Server: \n1. Master\n2. Slave\n");
    let port: number;

    switch (portSelect) {
        case ServerList.master:
            port = 3000;
            break;
        case ServerList.slave:
            port = 3001;
            break;
        default:
            process.exit(1);
    }

    client = Net.createConnection({ host: "127.0.0.1", port }, () => {
        client.setNoDelay(true);
        const req: R = { type: "login", body: "", name };
        client.write(JSON.stringify(req));
    });

    client.on("connect", function () {
        console.log("已經與伺服器端建立連接");
    });

    client.on("data", function (dataBuffer: Buffer) {
        const dataArr: string[] = dataBuffer.toString().replace(/}{/g, "}}{{").split(/}{/g);
        let dArr: R[];
        try {
            dArr = dataArr.map((d: string) => JSON.parse(d));
        } catch (err) {
            console.log(dataArr, err);
            return;
        }

        dArr.forEach((d: R) => {
            if (d.type == "msg" || d.type == "err") {
                console.log(`${d.type}: ${d.body}`);

                return;
            }
            if (d.type == "req") {
                if (d.isGameOver) {
                    clearInterval(atkTimer);
                    attacking = false;
                }
                rl.question(`${d.type} : ${d.body}`).then((input) => {
                    client.write(JSON.stringify({ type: "res", body: input, name }));
                });
                return;
            }
            if (d.type == "fightLog") {
                console.log(`${d.type} : ${d.body},${d.isGameOver}`);

                if (d.isGameOver) {
                    clearInterval(atkTimer);
                    attacking = false;
                }
                if (!d.isGameOver && !attacking) {
                    atkTimer = setInterval(() => {
                        attacking = true;
                        client.write(JSON.stringify({ type: "fight", body: "", name }));
                    }, 10);
                }
            }
        });
    });
    client.on("close", function (data) {
        console.log("Connect close");
    });

    client.on("error", (err): void => {
        console.log(err);
    });
})();
