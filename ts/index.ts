import Net from "net";
import * as ReadLine from "readline/promises";

const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// tcp客戶端
interface R {
    type: string;
    body: string;
    isGameOver?: boolean;
}

let client: Net.Socket;

(async () => {
    const name: string = await rl.question("Enter Your Name:");
    client = Net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
        client.setNoDelay(true);
        const req: R = { type: "login", body: name };
        client.write(JSON.stringify(req));
    });

    client.on("connect", function () {
        console.log("已經與伺服器端建立連接");
    });

    client.on("data", function (data: Buffer) {
        let d: R;
        try {
            d = JSON.parse(data.toString());
        } catch (err) {
            console.log(data.toString(), err);
            return;
        }

        if (d.type == "msg" || d.type == "err") {
            console.log(`${d.type}: ${d.body}`);
            return;
        }
        if (d.type == "req") {
            rl.question(`${d.body}`).then((input) => {
                client.write(JSON.stringify({ type: "res", body: input, name }));
            });
            return;
        }
        if (d.type == "fightLog") {
            console.log(`${d.type} : ${d.body}`);

            if (!d.isGameOver) {
                client.write(JSON.stringify({ type: "fight", body: name }));
                return;
            }
        }
    });
    client.on("close", function (data) {
        console.log("Connect close");
    });

    client.on("error", (err): void => {
        console.log(err);
    });
})();
