const net = require("net");

const port = 3000;
const host = "127.0.0.1";

// 建立連接
const client = net.createConnection(port, host, port);
// 1. 連接server,成功後觸發
client.on("connect", () => {
    console.log("1. client is connected");
});

// 2. 請求data, 未傳參數為Buffer
client.on("data", (data) => {
    // 3. 返回的
    console.log(data);
    let a = data.toString();
    console.log("2. client get server data:", a);
    console.log(typeof JSON.parse(a));
    client.write("a");
    client.write("b");
});

// client.end("this is client");
