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
exports.CourseCategoriesUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const sqlUtils_1 = require("../../../helpers/sqlUtils");
class CourseCategoriesUtils {
    constructor() {
        this.sqlUtils = new sqlUtils_1.SqlUtils();
        // Create Category
        this.create = (categoryDetails) => My.insert(tables_1.Tables.CATEGORY, categoryDetails);
        /**
         * Get Category by ID
         * @param categoryDetails
         * @returns
         */
        this.getById = (categoryId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.first(tables_1.Tables.CATEGORY, ["id", "title", "status", "created_at", "updated_at", "deleted_at"], "id=?", [categoryId]);
        });
        /**
         * Get All Categorys
         * @param categoryDetails
         * @returns
         */
        this.getAllCategories = () => __awaiter(this, void 0, void 0, function* () {
            const getAllCategories = yield My.findAll(tables_1.Tables.CATEGORY, [
                "id",
                "title",
                "status",
                "created_at",
                "updated_at",
                "deleted_at",
            ], "status!=?", ["deleted"]);
            return getAllCategories;
        });
        /**
         * Category Status changed to Deleted by ID
         * @param categoryDetails
         * @returns
         */
        this.destroy = (categoryId) => __awaiter(this, void 0, void 0, function* () {
            const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const updatedRecord = yield My.update(tables_1.Tables.CATEGORY, { status: "deleted", deleted_at: currentTimestamp }, "id=?", [categoryId]);
            return updatedRecord;
        });
        /**
         * Category Status changed to Active and remove data of deleted_at column by ID
         * @param categoryDetails
         * @returns
         */
        this.restoreCategory = (categoryId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.CATEGORY, { status: "active", deleted_at: null }, "id=?", [categoryId]);
        });
        /**
         * Category Update Fields by ID
         * @param categoryId string
         * @param categoryDetails Json
         * @returns
         */
        this.updateById = (categoryId, categoryDetails) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.CATEGORY, categoryDetails, "id=?", [
                categoryId,
            ]);
        });
    }
}
exports.CourseCategoriesUtils = CourseCategoriesUtils;
//# sourceMappingURL=courseCategoriesUtils.js.map