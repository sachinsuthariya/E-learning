"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordModel = exports.ForgotPasswordModel = exports.VerifyOtpModel = exports.AuthenticationModel = exports.AuthModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
const authValidators_1 = require("./authValidators");
class AuthModel extends model_1.Model {
    constructor(body) {
        super();
        const { firstName, lastName, mobile, email, password, } = body;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobile = mobile;
        this.email = email;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], AuthModel.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], AuthModel.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], AuthModel.prototype, "mobile", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail({}, { message: "EMAIL_INVALID" }),
    class_validator_1.Validate(authValidators_1.IsEmailAlreadyExistConstraint, {
        message: "ERR_EMAIL_ALREADY_EXISTS",
    })
], AuthModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.Validate(authValidators_1.IsPasswordMatchesRequirementsConstraint, {
        message: "PASSWORD_WARNING",
    })
], AuthModel.prototype, "password", void 0);
exports.AuthModel = AuthModel;
class AuthenticationModel extends model_1.Model {
    constructor(body) {
        super();
        const { email, password, } = body;
        this.email = email;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail({}, { message: "EMAIL_INVALID" })
], AuthenticationModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], AuthenticationModel.prototype, "password", void 0);
exports.AuthenticationModel = AuthenticationModel;
class VerifyOtpModel extends model_1.Model {
    constructor(body) {
        super();
        const { email, otp, } = body;
        this.email = email;
        this.otp = otp;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], VerifyOtpModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], VerifyOtpModel.prototype, "otp", void 0);
exports.VerifyOtpModel = VerifyOtpModel;
class ForgotPasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { email, } = body;
        this.email = email;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ForgotPasswordModel.prototype, "email", void 0);
exports.ForgotPasswordModel = ForgotPasswordModel;
class ResetPasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { token, password, } = body;
        this.token = token;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ResetPasswordModel.prototype, "token", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.Validate(authValidators_1.IsPasswordMatchesRequirementsConstraint, {
        message: "PASSWORD_WARNING",
    })
], ResetPasswordModel.prototype, "password", void 0);
exports.ResetPasswordModel = ResetPasswordModel;
//# sourceMappingURL=authModel.js.map