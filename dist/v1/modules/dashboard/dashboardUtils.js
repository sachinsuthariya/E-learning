"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUtils = void 0;
const tables_1 = require("../../../config/tables");
const My = require("jm-ez-mysql");
class DashboardUtils {
    // dashboard API's
    getTotalData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get total registerd user
                const query = `SELECT COUNT(uid) as totalUser FROM ${tables_1.Tables.USER}`;
                const totalUser = yield My.query(query);
                return {
                    totalUser: totalUser[0].totalUser,
                    totalDocument: 0
                };
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.DashboardUtils = DashboardUtils;
//# sourceMappingURL=dashboardUtils.js.map