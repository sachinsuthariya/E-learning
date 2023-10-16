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
exports.UserController = void 0;
const bcryptjs = require("bcryptjs");
const constants_1 = require("../../../config/constants");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const userUtils_1 = require("./userUtils");
const utils_1 = require("../../../helpers/utils");
class UserController {
    constructor() {
        this.userUtils = new userUtils_1.UserUtils();
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = utils_1.Utils.generateUUID();
                const hashedPassword = bcryptjs.hashSync(req.body.password.toString(), constants_1.Constants.PASSWORD_HASH);
                const user = {
                    id: userId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    password: hashedPassword,
                    role: req.body.role,
                    dob: req.body.dob,
                    city: req.body.city,
                    upscAttempts: req.body.upscAttempts,
                    upscTargetYear: req.body.upscTargetYear,
                    status: req.body.status
                };
                yield this.userUtils.createUser(user);
                const createdUser = yield this.userUtils.getUserById(userId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, "User created successfully", createdUser);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.error(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
                return res.status(response.error.code).json(response);
            }
        });
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield this.userUtils.getUserById(id);
                if (!user) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, "User not found");
                    return res.status(response.error.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, "User retrieved successfully", user);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.error(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
                return res.status(response.error.code).json(response);
            }
        });
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield this.userUtils.getAllUsers();
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, "All users retrieved successfully", allUsers);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const deletedUser = yield this.userUtils.deleteUser(id);
                if (!deletedUser) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, "User not found");
                    return res.status(response.error.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, "User deleted successfully");
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.restoreUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const restoredUser = yield this.userUtils.restoreUser(id);
                if (!restoredUser) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, "User not found");
                    return res.status(response.error.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, "User restored successfully");
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const userUpdates = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    // role: req.body.role,
                    dob: req.body.dob,
                    city: req.body.city,
                    upscAttempts: req.body.upscAttempts,
                    upscTargetYear: req.body.upscTargetYear,
                };
                const updatedUser = yield this.userUtils.updateUser(userId, userUpdates);
                if (!updatedUser) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, "User not found");
                    return res.status(response.error.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, "User updated successfully", updatedUser);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.error(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
                return res.status(response.error.code).json(response);
            }
        });
        this.updateUserStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const userUpdates = {
                    status: req.body.status
                };
                const updatedUser = yield this.userUtils.updateUser(userId, userUpdates);
                if (!updatedUser) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, "User not found");
                    return res.status(response.error.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, "User status updated successfully", updatedUser);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.error(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
                return res.status(response.error.code).json(response);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map