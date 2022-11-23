import Net from "net";
const { MAIN_PORT } = process.env;
let tryTime = 1;

export function StartSync() {
    Main = Net.createConnection({ host: "127.0.0.1", port: +MAIN_PORT },()=>{
        console.log("Game-Server connected")
    });

    Main.on("error", (err) => {
        console.log(err);
        if (/ECONNREFUSED/g.test(err.message)) {
            console.log(`Try reconnect in 5 secs... (${tryTime})`);
            setTimeout(() => {
                ++tryTime;
                StartSync();
                return;
            }, 5000);
        }
    });
}

export let Main: Net.Socket;
