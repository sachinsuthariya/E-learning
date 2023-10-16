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
exports.CurrentAffairsUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const sqlUtils_1 = require("../../../helpers/sqlUtils");
class CurrentAffairsUtils {
    constructor() {
        this.sqlUtils = new sqlUtils_1.SqlUtils();
        // Create Current Affairs
        this.create = (currentAffairsDetails) => My.insert(tables_1.Tables.CURRENT_AFFAIRS, currentAffairsDetails);
        /**
         * Get Current Affair by ID
         * @param currentAffairsDetails
         * @returns
         */
        this.getById = (currentAffairsId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.first(tables_1.Tables.CURRENT_AFFAIRS, ["id", "title", "content", "status", "created_at", "updated_at", "deleted_at"], "id=?", [currentAffairsId]);
        });
        /**
         * Get All Current Affairs
         * @param currentAffairsDetails
         * @returns
         */
        this.getAllCurrentAffairs = () => __awaiter(this, void 0, void 0, function* () {
            const getAllCurrentAffairs = yield My.findAll(tables_1.Tables.CURRENT_AFFAIRS, [
                "id",
                "title",
                "content",
                "status",
                "created_at",
                "updated_at",
                "deleted_at"
            ], "status!=?", ["deleted"]);
            return getAllCurrentAffairs;
        });
        /**
         * Current Affair Status changed to Deleted by ID
         * @param currentAffairsDetails
         * @returns
         */
        this.destroy = (currentAffairsId) => __awaiter(this, void 0, void 0, function* () {
            const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const updatedRecord = yield My.update(tables_1.Tables.CURRENT_AFFAIRS, { status: "deleted", deleted_at: currentTimestamp }, "id=?", [currentAffairsId]);
            return updatedRecord;
        });
        /**
         * Current Affair Status changed to Draft and remove data of deleted_at column by ID
         * @param currentAffairsDetails
         * @returns
         */
        this.restoreCurrentAffair = (currentAffairsId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.CURRENT_AFFAIRS, { status: "draft", deleted_at: null }, "id=?", [currentAffairsId]);
        });
        /**
         * Current Affair Update Fields by ID
         * @param currentAffairsId string
         * @param currentAffairsDetails Json
         * @returns
         */
        this.updateById = (currentAffairsId, currentAffairDetails) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.CURRENT_AFFAIRS, currentAffairDetails, "id=?", [
                currentAffairsId,
            ]);
        });
    }
}
exports.CurrentAffairsUtils = CurrentAffairsUtils;
//# sourceMappingURL=currentAffairsUtils.js.map