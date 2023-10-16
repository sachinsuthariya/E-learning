"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dates = void 0;
// import * as moment from 'moment';
const moment = require("moment-timezone");
class Dates {
    getTodayDate(timezone) {
        const newdate = moment().tz(timezone);
        newdate.set({ second: 0, millisecond: 0 });
        return newdate.format();
    }
    addDays(date, days) {
        const newdate = moment(date).add(days, "days");
        newdate.set({ second: 0, millisecond: 0 });
        return newdate.format();
    }
}
exports.Dates = Dates;
//# sourceMappingURL=date.js.map