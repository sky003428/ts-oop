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
let name: string;

(async () => {
    const input = await rl.question("Enter Your Name:");
    client = Net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
        const req: R = { type: "login", body: input };
        name = input;
        client.write(JSON.stringify(req));
    });

    client.on("connect", function () {
        console.log("已經與伺服器端建立連接");
    });

    client.on("data", function (data: Buffer) {
        console.log("接到訊息");
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
        if (d.type == "get") {
            if (d.body == "name") {
                rl.question("Incorrect! Please enter name again:").then((input: string) => {
                    const res: R = { type: "login", body: input };
                    name = input;
                    client.write(JSON.stringify(res));
                });
            } else if (d.body == "wait") {
                rl.question("Phoenix Already Died, Wait For Phoenix,[y/n]").then((input: string) => {
                    //    todo
                    client.write(JSON.stringify(input));
                });
            }
            return;
        }
        if (d.type == "fightLog") {
            console.log(`${d.type}: ${d.body}`);
            if (!d.isGameOver) {
                const res: R = { type: "fight", body: name };
                client.write(JSON.stringify(res));
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
