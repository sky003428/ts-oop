import * as mysql from "mysql";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "phoenix",
});

export default db;
