"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const jmEzMySql = require("jm-ez-mysql");
class DB {
    static init() {
        jmEzMySql.init({
            acquireTimeout: 100 * 60 * 1000,
            connectTimeout: 100 * 60 * 1000,
            connectionLimit: 10000,
            database: process.env.DATABASE,
            port: process.env.DBPORT || 3306,
            dateStrings: true,
            host: process.env.DBHOST,
            multipleStatements: true,
            password: process.env.DBPASSWORD,
            timeout: 100 * 60 * 1000,
            timezone: "utc",
            user: process.env.DBUSER,
        });
    }
}
exports.DB = DB;
//# sourceMappingURL=database.js.map