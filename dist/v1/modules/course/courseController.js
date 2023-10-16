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
exports.CourseController = void 0;
const constants_1 = require("../../../config/constants");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const courseUtils_1 = require("./courseUtils");
const utils_1 = require("../../../helpers/utils");
class CourseController {
    constructor() {
        this.courseUtils = new courseUtils_1.CourseUtils();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.id = utils_1.Utils.generateUUID();
                yield this.courseUtils.create(req.body);
                const course = yield this.courseUtils.getById(req.body.id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const course = yield this.courseUtils.getById(id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.allCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCourses = yield this.courseUtils.getAllCourses();
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllCourses);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const course = yield this.courseUtils.destroy(id);
                if (!course || !course.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                    return res.status(response.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_CURRENT_AFFAIR_DELETE"));
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.restore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const course = yield this.courseUtils.restoreCourse(id);
                if (!course || !course.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                    return res.status(response.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_CURRENT_AFFAIR_RESTORE"));
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.id;
                const courseDetails = {
                    title: req.body.title,
                    description: req.body.description,
                    category_id: req.body.category_id,
                    isIncludesLiveClass: req.body.isIncludesLiveClass,
                    isFree: req.body.isFree,
                    materials: req.body.materials,
                    price: req.body.price,
                    material_price: req.body.material_price,
                    status: req.body.status
                };
                const updateCourse = yield this.courseUtils.updateById(courseId, courseDetails);
                if (!updateCourse || !updateCourse.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const course = yield this.courseUtils.getById(courseId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.updateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.id;
                const courseDetails = {
                    status: req.body.status
                };
                const updateCourses = yield this.courseUtils.updateById(courseId, courseDetails);
                if (!updateCourses || !updateCourses.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const course = yield this.courseUtils.getById(courseId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
    }
}
exports.CourseController = CourseController;
//# sourceMappingURL=courseController.js.map