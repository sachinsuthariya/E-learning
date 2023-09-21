import { Constants } from "../config/constants";
import * as My from "jm-ez-mysql";
import { Utils } from "./utils";

export class SqlUtils {

    // list with pagination
    public getListWithPagination = async (model, params, cond, id, orderBy, reqData) => {
        const {
            limit
        } = Constants.PAGES;
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
        const list = await My.findAllWithCount(model, id, params, cond, additional);
        if (list.result.length) {
            const pagination = await Utils.pagination(list.count, limit);
            return {
                pagination,
                list: list.result
            };
        }
        return false;
    }
}
