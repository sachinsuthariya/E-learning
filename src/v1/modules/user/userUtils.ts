import { SqlUtils } from "../../../helpers/sqlUtils";
import { Tables } from "../../../config/tables";
import * as My from "jm-ez-mysql";

export class UserUtils {
    public sqlUtils: SqlUtils = new SqlUtils();

    // get list of user
    public getUserList(reqData) {
        try {
            const field = ["uId as id, fullName, mobile, email, STR_TO_DATE(createdAt, '%Y-%m-%d') as createdAt, isActive"];

            let where = `(isDelete = false)`;
            where += reqData.regDate ? ` AND (DATE(createdAt) = '${reqData.regDate}')` : '';
            // where += reqData.verifyStatus ? ` AND (isVerified = ${reqData.verifyStatus})` : ''; // temp not in use
            where += reqData.status ? ` AND (isActive = ${reqData.status})` : '';
            where += reqData.userName ? ` AND (fullName LIKE '%${reqData.userName}%')` : '';
            where += reqData.userId ? ` AND (uId = '${reqData.userId}')` : '';
            where += reqData.email ? ` AND (email LIKE '%${reqData.email}%')` : '';

            const order = `createdAt ${reqData.sort}`;

            return this.sqlUtils.getListWithPagination(Tables.USER, field, where, "uId", order, reqData);
        } catch (err) {
            return err;
        }
    }

    // update User by Id
    public async updateUserDetails(details: Json, uId: number) {
        try {
            delete details._user;
            return await My.updateFirst(Tables.USER, details, "uId = ?", [uId]);
        } catch (err) {
            return err;
        }
    }

    // get user detail by id
    public async getUserDetails(uId: number) {
        try {
            return await My.first(Tables.USER, ["*"], `uId = ?`, [uId]);
        } catch (err) {
            return err;
        }
    }

}