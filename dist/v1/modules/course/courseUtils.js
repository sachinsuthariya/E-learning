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
exports.CourseUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const sqlUtils_1 = require("../../../helpers/sqlUtils");
class CourseUtils {
    constructor() {
        this.sqlUtils = new sqlUtils_1.SqlUtils();
        // Create Courses
        this.create = (courseDetails) => My.insert(tables_1.Tables.COURSE, courseDetails);
        /**
         * Get Course by ID
         * @param courseDetails
         * @returns
         */
        this.getById = (courseId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.first(tables_1.Tables.COURSE, ["id", "title", "description", "isIncludesLiveClass", "category_id", "isFree", "materials", "price", "material_price", "attachment", "status", "created_at", "updated_at", "deleted_at"], "id=?", [courseId]);
        });
        /**
         * Get All Courses
         * @param courseDetails
         * @returns
         */
        this.getAllCourses = () => __awaiter(this, void 0, void 0, function* () {
            const getAllCourses = yield My.findAll(tables_1.Tables.COURSE, [
                "id",
                "title",
                "description",
                "isIncludesLiveClass",
                "category_id",
                "isFree",
                "materials",
                "price",
                "material_price",
                "attachment",
                "status",
                "created_at",
                "updated_at",
                "deleted_at"
            ], "status!=?", ["deleted"]);
            return getAllCourses;
        });
        /**
         * Course Status changed to Deleted by ID
         * @param courseDetails
         * @returns
         */
        this.destroy = (courseId) => __awaiter(this, void 0, void 0, function* () {
            const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const updatedRecord = yield My.update(tables_1.Tables.COURSE, { status: "deleted", deleted_at: currentTimestamp }, "id=?", [courseId]);
            return updatedRecord;
        });
        /**
         * Course Status changed to Draft and remove data of deleted_at column by ID
         * @param courseDetails
         * @returns
         */
        this.restoreCourse = (courseId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.COURSE, { status: "active", deleted_at: null }, "id=?", [courseId]);
        });
        /**
         * Course Update Fields by ID
         * @param courseId string
         * @param courseDetails Json
         * @returns
         */
        this.updateById = (courseId, courseDetails) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.COURSE, courseDetails, "id=?", [
                courseId,
            ]);
        });
    }
}
exports.CourseUtils = CourseUtils;
//# sourceMappingURL=courseUtils.js.map