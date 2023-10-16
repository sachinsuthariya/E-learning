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
exports.SqlUtils = void 0;
const constants_1 = require("../config/constants");
const My = require("jm-ez-mysql");
const utils_1 = require("./utils");
class SqlUtils {
    constructor() {
        // list with pagination
        this.getListWithPagination = (model, params, cond, id, orderBy, reqData) => __awaiter(this, void 0, void 0, function* () {
            const { limit } = constants_1.Constants.PAGES;
            let pg = null;
            if (+reqData.pg) {
                pg = 0;
                if (+reqData.pg && +reqData.pg > 1) {
                    pg = (+reqData.pg - 1) * limit;
                }
            }
            const paginate = ` LIMIT ${limit} OFFSET ${pg}`;
            let additional = ` ORDER BY ${orderBy}`;
            if (pg != null) {
                additional += `${paginate}`;
            }
            const list = yield My.findAllWithCount(model, id, params, cond, additional);
            if (list.result.length) {
                const pagination = yield utils_1.Utils.pagination(list.count, limit);
                return {
                    pagination,
                    list: list.result
                };
            }
            return false;
        });
    }
}
exports.SqlUtils = SqlUtils;
//# sourceMappingURL=sqlUtils.js.map