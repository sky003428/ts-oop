
const Net = require("net");

// const { MAIN_PORT } = process.env;

const main = Net.createConnection({ host: "127.0.0.1", port:5050 }, async () => {
    await monster.getMonster("鳳凰");
    monster.sync(main);
});

main.on("data", async (dataBuffer) => {});

main.on("error", (err) => {
    console.log("GGG\r\n" + err);
});
