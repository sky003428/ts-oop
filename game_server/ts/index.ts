import "dotenv/config";
import Server from "./game_server/server";
import SyncSocket from "./sync_socket";

const { HOST, PORT } = process.env;

Server.listen({ host: HOST, port: PORT }, () => {
    console.log(`Game-Server start at ${HOST}:${PORT}`);
});

SyncSocket.listen({ host: HOST, port: 888 }, () => {
    console.log(`Sync start at ${HOST}:888`);
});
