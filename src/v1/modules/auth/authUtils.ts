import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class AuthUtils {
    public sqlUtils: SqlUtils = new SqlUtils();

    // Create user
    public createUser(userDetail: Json) {
        return My.insert(Tables.USER, userDetail);
    }

    // check user email is exists or not
    public checkEmailExists(email: string) {
        return My.first(Tables.USER, ["id", "firstName", "lastName", "role", "status", "mobile", "email", "emailVerified", "password"],
            "email = ?", [email]);
    }

    // get user detail by id
    public getUserById(userId: string) {
        const field = ["id", "firstName", "lastName", "role", "status", "emailVerified", "email", "mobile", "password"];
        return My.first(Tables.USER, field, `id = ?`, [userId]);
    }

    public getUserByEmail(email: string){
        const field = ["id", "firstName", "lastName", "role", "status", "emailVerified", "email", "mobile", "password"];
        return My.first(Tables.USER, field, `email = ?`, [email]);
    }

    // update user by Id
    public updateUserDetails(details: Json, id: number) {
        try {
            return My.updateFirst(Tables.USER, details, "id = ?", [id]);
        } catch (err) {
            return err;
        }
    }

}