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
exports.UserUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
class UserUtils {
    constructor() {
        // Create User
        this.createUser = (userDetails) => My.insert(tables_1.Tables.USER, userDetails);
        /**
         * Get User by ID
         * @param userId
         * @returns
         */
        this.getUserById = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.first(tables_1.Tables.USER, ["id", "firstName", "lastName", "email", "mobile", "role", "dob", "city", "status"], "id=?", [userId]);
        });
        /**
         * Get All Users
         * @returns
         */
        this.getAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            const getAllUsers = yield My.findAll(tables_1.Tables.USER, [
                "id",
                "firstName",
                "lastName",
                "email",
                "mobile",
                "role",
                "dob",
                "city",
                // "upscAttempts",
                // "upscTargetYear",
                "status"
            ]);
            return getAllUsers;
        });
        /**
         * Delete User by ID
         * @param userId
         * @returns
         */
        this.deleteUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield My.delete(tables_1.Tables.USER, "id=?", [userId]);
            return deletedUser;
        });
        /**
         * Restore User by ID
         * @param userId
         * @returns
         */
        this.restoreUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            const restoredUser = yield My.update(tables_1.Tables.USER, { status: "active" }, "id=?", [userId]);
            return restoredUser;
        });
        /**
         * Update User by ID
         * @param userId
         * @param userDetails
         * @returns
         */
        this.updateUser = (userId, userUpdates) => __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield My.update(tables_1.Tables.USER, userUpdates, "id=?", [userId]);
            return updatedUser;
        });
    }
}
exports.UserUtils = UserUtils;
//# sourceMappingURL=userUtils.js.map
