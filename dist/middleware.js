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
exports.Middleware = void 0;
const constants_1 = require("./config/constants");
const jwt_1 = require("./helpers/jwt");
const responseBuilder_1 = require("./helpers/responseBuilder");
const authUtils_1 = require("./v1/modules/auth/authUtils");
const enums_1 = require("./config/enums");
class Middleware {
    constructor() {
        this.authUtils = new authUtils_1.AuthUtils();
        this.isAuthenticatedAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers["x-auth-token"] || req.headers["authentication"];
                if (!token) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
                const userData = jwt_1.Jwt.decodeAuthToken(token);
                if (!userData.id) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
                req.user = yield this.authUtils.getUserById(userData.id);
                if (req.user.id == userData.id && req.user.role == enums_1.UserRole.ADMIN && req.user.email == userData.email) {
                    next();
                }
                else {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.isAuthenticatedProfessor = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers["x-auth-token"] || req.headers["authentication"];
                if (!token) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
                const userData = jwt_1.Jwt.decodeAuthToken(token);
                if (!userData.id) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
                req.user = yield this.authUtils.getUserById(userData.id);
                if (req.user.id == userData.id && req.user.role == enums_1.UserRole.PROFESSIOR && req.user.email == userData.email && req.user.mobile && userData.mobile) {
                    next();
                }
                else {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.isAuthenticatedStudent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers["x-auth-token"] || req.headers["authentication"];
                console.log(req.headers);
                if (!token) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
                const userData = jwt_1.Jwt.decodeAuthToken(token);
                if (!userData.id) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
                req.user = yield this.authUtils.getUserById(userData.id);
                if (req.user.id == userData.id && req.user.role == enums_1.UserRole.STUDENT && req.user.email == userData.email && req.user.mobile == userData.mobile) {
                    next();
                }
                else {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
                    return res.status(response.error.code).json(response);
                }
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.isUserActive = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const userData = yield this.authUtils.getUserById(userId);
            if (userData.status == enums_1.UserStatus.ACTIVE) {
                next();
            }
            const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.UNAUTHORIZED_CODE, req.t("ERR_ACCOUNT_NOT_ACTIVE"));
            return res.status(response.error.code).json(response);
        });
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map