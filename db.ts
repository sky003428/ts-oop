import * as mysql from "mysql";

const db = mysql.createPool({
    host: "172.17.0.2",
    user: "root",
    password: "admin",
    database: "phoenix",
});

export default db;
