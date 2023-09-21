import { Tables } from "../../../config/tables";
import * as My from "jm-ez-mysql";

export class DashboardUtils {

    // dashboard API's
    public async getTotalData() {
        try {
            // get total registerd user
            const query = `SELECT COUNT(uid) as totalUser FROM ${Tables.USER}`;
            const totalUser = await My.query(query);

            return {
                totalUser: totalUser[0].totalUser,
                totalDocument: 0
            };
        } catch (err) {
            return err;
        }
    }
}