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
exports.CurrentAffairsController = void 0;
const constants_1 = require("../../../config/constants");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const currentAffairsUtils_1 = require("./currentAffairsUtils");
const utils_1 = require("../../../helpers/utils");
class CurrentAffairsController {
    constructor() {
        this.currentAffairsUtils = new currentAffairsUtils_1.CurrentAffairsUtils();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.id = utils_1.Utils.generateUUID();
                yield this.currentAffairsUtils.create(req.body);
                const currentAffairs = yield this.currentAffairsUtils.getById(req.body.id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffairs);
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
                const currentAffair = yield this.currentAffairsUtils.getById(id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffair);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.allCurrentAffairs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCurrentAffairs = yield this.currentAffairsUtils.getAllCurrentAffairs();
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllCurrentAffairs);
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
                const currentAffair = yield this.currentAffairsUtils.destroy(id);
                if (!currentAffair || !currentAffair.affectedRows) {
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
                const currentAffair = yield this.currentAffairsUtils.restoreCurrentAffair(id);
                if (!currentAffair || !currentAffair.affectedRows) {
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
                const currentAffairId = req.params.id;
                const currentAffairDetails = {
                    title: req.body.title,
                    content: req.body.content,
                    status: req.body.status
                };
                const updateCurrentAffairs = yield this.currentAffairsUtils.updateById(currentAffairId, currentAffairDetails);
                if (!updateCurrentAffairs || !updateCurrentAffairs.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const currentAffairs = yield this.currentAffairsUtils.getById(currentAffairId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffairs);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.updateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentAffairId = req.params.id;
                const currentAffairDetails = {
                    status: req.body.status
                };
                const updateCurrentAffairs = yield this.currentAffairsUtils.updateById(currentAffairId, currentAffairDetails);
                if (!updateCurrentAffairs || !updateCurrentAffairs.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const currentAffairs = yield this.currentAffairsUtils.getById(currentAffairId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffairs);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
    }
}
exports.CurrentAffairsController = CurrentAffairsController;
//# sourceMappingURL=currentAffairsController.js.map