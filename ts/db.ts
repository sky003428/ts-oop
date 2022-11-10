import Mysql from "mysql";
import "dotenv/config";


const Db = Mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

export default Db;
