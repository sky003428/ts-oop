import "dotenv/config";
import LoginServer from "./login_server/login_server";
import { StartSync } from "./sync_socket";
const { HOST, PORT } = process.env;

LoginServer.listen({ host: HOST, port: PORT }, () => {
    console.log(`Login-Server start at ${HOST}:${PORT}`);
});

StartSync();
