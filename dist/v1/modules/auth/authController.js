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
exports.AuthController = void 0;
const bcryptjs = require("bcryptjs");
const constants_1 = require("../../../config/constants");
const jwt_1 = require("../../../helpers/jwt");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const authUtils_1 = require("./authUtils");
const enums_1 = require("../../../config/enums");
const utils_1 = require("../../../helpers/utils");
const sendEmail_1 = require("../../../helpers/sendEmail");
class AuthController {
    constructor() {
        this.authUtils = new authUtils_1.AuthUtils();
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.id = utils_1.Utils.generateUUID();
                req.body.role = enums_1.UserRole.STUDENT;
                // Encrypt password
                req.body.password = bcryptjs.hashSync(req.body.password.toString(), constants_1.Constants.PASSWORD_HASH);
                // Process and save the uploaded image if it exists
                // if (req.body.image) {
                //   const matches = req.body.image.match(/^data:image\/([A-Za-z]+);base64,(.+)$/);
                //   if (matches.length === 3) {
                //     const extension = matches[1]; // Get the file extension (e.g., "png", "jpg", "jpeg", etc.)
                //     const base64Data = matches[2];
                //     const imageBuffer = Buffer.from(base64Data, 'base64');
                //     const imagePath = `uploads/${req.body.id}.${extension}`;
                //     fs.writeFileSync(imagePath, imageBuffer);
                //     req.body.imagePath = imagePath;
                //   } else {
                //     return res.status(400).send('Invalid image data format');
                //   }
                // }
                const result = yield this.authUtils.createUser(req.body);
                // JWT token
                const payload = {
                    id: req.body.id,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    role: req.body.role,
                    dob: req.body.dob,
                    city: req.body.city,
                    upscAttempts: req.body.upscAttempts,
                    upscTargetYear: req.body.upscTargetYear,
                };
                const token = jwt_1.Jwt.getAuthToken(payload);
                const emailData = {
                    "{USERNAME}": req.body.firstName || "" + req.body.lastName || "",
                    "{{LINK}}": `${process.env.FE_DOMAIN}/${token}`,
                };
                yield sendEmail_1.SendEmail.sendRawMail("signup", emailData, [req.body.email], constants_1.Constants.EMAIL_SUBJECTS.SINGUP);
                const userDetails = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    role: req.body.role,
                    dob: req.body.dob,
                    city: req.body.city,
                    upscAttempts: req.body.upscAttempts,
                    upscTargetYear: req.body.upscTargetYear,
                    token,
                };
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), userDetails);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.log('err =>', err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        // Admin login
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    id: req.body._authentication.id,
                    email: req.body._authentication.email,
                    mobile: req.body._authentication.mobile,
                    role: req.body._authentication.role,
                    dob: req.body._authentication.dob,
                    city: req.body._authentication.city,
                    upscAttempts: req.body._authentication.upscAttempts,
                    upscTargetYear: req.body._authentication.upscTargetYear,
                };
                const token = jwt_1.Jwt.getAuthToken(payload);
                const data = {
                    id: req.body._authentication.id,
                    firstName: req.body._authentication.firstName,
                    lastName: req.body._authentication.lastName,
                    mobile: req.body._authentication.mobile,
                    email: req.body._authentication.email,
                    role: req.body._authentication.role,
                    dob: req.body._authentication.dob,
                    city: req.body._authentication.city,
                    upscAttempts: req.body._authentication.upscAttempts,
                    upscTargetYear: req.body._authentication.upscTargetYear,
                    token,
                };
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_LOGIN"), data);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        // forgot password
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const user = yield this.authUtils.getUserByEmail(email);
                if (user) {
                    // JWT token
                    const payload = {
                        id: user.id,
                        email: user.email,
                        mobile: user.mobile,
                        role: user.role,
                    };
                    const token = jwt_1.Jwt.getAuthToken(payload);
                    const emailData = {
                        "{USERNAME}": user.firstName || "" + user.lastName || "",
                        "{{LINK}}": `${process.env.FE_DOMAIN}/${token}`,
                    };
                    yield sendEmail_1.SendEmail.sendRawMail("forget-password", emailData, [req.body.email], constants_1.Constants.EMAIL_SUBJECTS.FORGET_PASSWORD);
                    const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("FORGET_PASSWORD_EMAIL_SENT"));
                    return res.status(response.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.FAIL_CODE, req.t("USER_WITH_EMAIL_NOT_EXIST"));
                return res.status(response.error.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        // reset password
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.body.token;
                const password = req.body.password;
                const tokenInfo = jwt_1.Jwt.decodeAuthToken(token);
                if (tokenInfo && tokenInfo.id) {
                    const user = yield this.authUtils.getUserById(tokenInfo.id);
                    if (user.id == tokenInfo.id &&
                        user.email == tokenInfo.email &&
                        user.role == tokenInfo.role) {
                        const data = {
                            password: bcryptjs.hashSync(password.toString(), constants_1.Constants.PASSWORD_HASH),
                        };
                        const result = yield this.authUtils.updateUserDetails(data, user.id);
                        if (result.affectedRows) {
                            const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_CHANGE_PASSWORD"));
                            return res.status(response.code).json(response);
                        }
                    }
                }
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.FAIL_CODE, req.t("SOMETHING_WENT_WRONG"));
                return res.status(response.error.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.verifyAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const tokenInfo = jwt_1.Jwt.decodeAuthToken(token);
                if (tokenInfo && tokenInfo.id) {
                    const user = yield this.authUtils.getUserById(tokenInfo.id);
                    if (user.id == tokenInfo.id &&
                        user.email == tokenInfo.email &&
                        user.role == tokenInfo.role) {
                        const result = yield this.authUtils.updateUserDetails({ emailVerified: 1 }, user.id);
                        if (result.affectedRows) {
                            const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_EMAIL_VERIFICATION"));
                            return res.status(response.code).json(response);
                        }
                    }
                }
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.FAIL_CODE, req.t("SOMETHING_WENT_WRONG"));
                return res.status(response.error.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        // profile
        // get profile
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                delete req.user.password;
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), req.user);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        // update profile
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authUtils.updateUserDetails(req.body, req.user.id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_UPDATE_PROFILE"));
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        // change password
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { oldPassword, newPassword } = req.body;
                const userData = yield this.authUtils.getUserById(userId);
                const passCheck = yield bcryptjs.compare(oldPassword, userData.password);
                if (passCheck) {
                    const data = {
                        password: bcryptjs.hashSync(newPassword.toString(), constants_1.Constants.PASSWORD_HASH),
                    };
                    yield this.authUtils.updateUserDetails(data, userId);
                    const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS_CHANGE_PASSWORD"));
                    return res.status(response.code).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.FAIL_CODE, req.t("ERR_INVALID_PASSWORD"));
                return res.status(response.error.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map