import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class AuthUtils {
    public sqlUtils: SqlUtils = new SqlUtils();

    // Create Admin
    public createAdmin(adminDetail: Json) {
        try {
            return My.insert(Tables.ADMIN, adminDetail);
        } catch (err) {
            throw err;
        }
    }

    // check admin email is exists or not
    public checkAdminEmailExists(email: string) {
        try {
            return My.first(Tables.ADMIN, ["id", "firstName", "lastName", "mobile", "email", "password"],
                "email = ?", [email]);
        } catch (err) {
            throw err;
        }
    }

    // get user detail by id
    public getUserById(userId) {
        const field = ["id, firstName, lastName, email, mobile", "password"];
        return My.first(Tables.ADMIN, field, `id = ${userId}`);
    }

    // update Admin by Id
    public updateAdminDetails(details: Json, id: number) {
        try {
            return My.updateFirst(Tables.ADMIN, details, "id = ?", [id]);
        } catch (err) {
            return err;
        }
    }

}