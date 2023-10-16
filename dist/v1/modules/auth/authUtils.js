"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const sqlUtils_1 = require("../../../helpers/sqlUtils");
class AuthUtils {
    constructor() {
        this.sqlUtils = new sqlUtils_1.SqlUtils();
    }
    // Create user
    createUser(userDetail) {
        return My.insert(tables_1.Tables.USER, userDetail);
    }
    // check user email is exists or not
    checkEmailExists(email) {
        return My.first(tables_1.Tables.USER, ["id", "firstName", "lastName", "role", "status", "mobile", "email", "emailVerified", "password"], "email = ?", [email]);
    }
    // get user detail by id
    getUserById(userId) {
        const field = ["id", "firstName", "lastName", "role", "status", "emailVerified", "email", "mobile", "password"];
        return My.first(tables_1.Tables.USER, field, `id = ?`, [userId]);
    }
    getUserByEmail(email) {
        const field = ["id", "firstName", "lastName", "role", "status", "emailVerified", "email", "mobile", "password"];
        return My.first(tables_1.Tables.USER, field, `email = ?`, [email]);
    }
    // update user by Id
    updateUserDetails(details, id) {
        try {
            return My.updateFirst(tables_1.Tables.USER, details, "id = ?", [id]);
        }
        catch (err) {
            return err;
        }
    }
}
exports.AuthUtils = AuthUtils;
//# sourceMappingURL=authUtils.js.map