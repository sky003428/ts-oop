import * as Mysql from "mysql";

const db = Mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "phoenix",
});


export default db;
