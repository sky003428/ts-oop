import "dotenv/config";
import { startSync } from "./sync_socket";

const { MAIN_PORT } = process.env;

startSync("127.0.0.1", +MAIN_PORT);
