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
exports.CourseCategoriesController = void 0;
const constants_1 = require("../../../config/constants");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const courseCategoriesUtils_1 = require("./courseCategoriesUtils");
const utils_1 = require("../../../helpers/utils");
class CourseCategoriesController {
    constructor() {
        this.courseCategoriesUtils = new courseCategoriesUtils_1.CourseCategoriesUtils();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.id = utils_1.Utils.generateUUID();
                yield this.courseCategoriesUtils.create(req.body);
                const categories = yield this.courseCategoriesUtils.getById(req.body.id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), categories);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.allCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCategories = yield this.courseCategoriesUtils.getAllCategories();
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllCategories);
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
                const category = yield this.courseCategoriesUtils.destroy(id);
                if (!category || !category.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                    return res.status(response.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_CATEGORY_DELETE"), category);
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
                const category = yield this.courseCategoriesUtils.restoreCategory(id);
                if (!category || !category.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                    return res.status(response.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_CATEGORY_RESTORE"), category);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const categoryDetails = {
                    title: req.body.title
                };
                const updateCategory = yield this.courseCategoriesUtils.updateById(categoryId, categoryDetails);
                if (!updateCategory || !updateCategory.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("CATEGORY_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const category = yield this.courseCategoriesUtils.getById(categoryId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.updateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const categoryDetails = {
                    status: req.body.status
                };
                const updateCategory = yield this.courseCategoriesUtils.updateById(categoryId, categoryDetails);
                if (!updateCategory || !updateCategory.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("CATEGORY_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const category = yield this.courseCategoriesUtils.getById(categoryId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
    }
}
exports.CourseCategoriesController = CourseCategoriesController;
//# sourceMappingURL=courseCategoriesController.js.map