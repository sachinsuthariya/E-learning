"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const moment = require("moment-timezone");
const winston_1 = require("winston");
const constants_1 = require("../config/constants");
const { combine, timestamp, prettyPrint, colorize, } = winston_1.format;
class Log {
    static getLogger() {
        return winston_1.createLogger({
            format: combine(timestamp({ format: this.timestampFormat }), prettyPrint(), colorize()),
            level: "debug",
            transports: [new winston_1.transports.Console()],
        });
    }
}
exports.Log = Log;
Log.timestampFormat = moment(new Date()).tz(constants_1.Constants.TIMEZONE).format("YYYY-MM-DD hh:mm:ss");
//# sourceMappingURL=logger.js.map