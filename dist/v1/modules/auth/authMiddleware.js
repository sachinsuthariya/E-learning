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
exports.AuthMiddleware = void 0;
const bcryptjs = require("bcryptjs");
const constants_1 = require("../../../config/constants");
const authUtils_1 = require("./authUtils");
const enums_1 = require("../../../config/enums");
class AuthMiddleware {
    constructor() {
        this.authUtils = new authUtils_1.AuthUtils();
        this.checkCredentials = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // get user detail by email address
            const user = yield this.authUtils.checkEmailExists(req.body.email);
            // check credentials matches or not
            if (user && (yield bcryptjs.compare(req.body.password, user.password))) {
                if (user.status && user.status != enums_1.UserStatus.ACTIVE) {
                    return res.status(constants_1.Constants.UNAUTHORIZED_CODE).json({ error: req.t("ERR_ACCOUNT_NOT_ACTIVE"), code: constants_1.Constants.UNAUTHORIZED_CODE });
                }
                if (!user.emailVerified) {
                    return res.status(constants_1.Constants.UNAUTHORIZED_CODE).json({ error: req.t("ACCOUNT_NOT_VERIFIED_ERR"), code: constants_1.Constants.UNAUTHORIZED_CODE });
                }
                req.body._authentication = user;
                next();
            }
            else {
                return res.status(constants_1.Constants.UNAUTHORIZED_CODE).json({ error: req.t("INVALID_CREDENTIALS"), code: constants_1.Constants.UNAUTHORIZED_CODE });
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=authMiddleware.js.map