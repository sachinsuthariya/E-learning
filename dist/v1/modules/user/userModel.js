"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const class_validator_1 = require("class-validator");
const userValidators_1 = require("./userValidators");
const model_1 = require("../../../model");
class UserModel extends model_1.Model {
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
], UserModel.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], UserModel.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.Matches(/^[0-9]{10}$/)
], UserModel.prototype, "mobile", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail({}, { message: "Invalid email format" }),
    class_validator_1.Validate(userValidators_1.IsEmailAlreadyExistConstraint, {
        message: "ERR_EMAIL_ALREADY_EXISTS",
    })
], UserModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.Matches(/^(?!.* )(?=.*?[A-Z])(?=.*?[a-z]).{6,30}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long" })
], UserModel.prototype, "password", void 0);
exports.UserModel = UserModel;
//# sourceMappingURL=userModel.js.map