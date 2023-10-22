import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";

import { Model } from "../../../model";
import { IsEmailAlreadyExistConstraint, IsMobileAlreadyExistConstraint, IsPasswordMatchesRequirementsConstraint } from "./authValidators";

export class AuthModel extends Model {

    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @IsNotEmpty()
    @IsString()
    public lastName: string;

    @IsNotEmpty()
    @IsString()
    @Validate(IsMobileAlreadyExistConstraint, {
        message: "ERR_MOBILE_ALREADY_EXISTS",
    })
    public mobile: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "EMAIL_INVALID" })
    @Validate(IsEmailAlreadyExistConstraint, {
        message: "ERR_EMAIL_ALREADY_EXISTS",
    })
    public email: string;

    @IsNotEmpty()
    @Validate(IsPasswordMatchesRequirementsConstraint, {
        message: "PASSWORD_WARNING",
    })
    public password: string;

    constructor(body: any) {
        super();
        const {
            firstName,
            lastName,
            mobile,
            email,
            password,
        } = body;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobile = mobile;
        this.email = email;
        this.password = password;
    }
}

export class AuthenticationModel extends Model {
    @IsNotEmpty()
    @IsEmail({}, { message: "EMAIL_INVALID" })
    public email: string;

    @IsNotEmpty()
    public password: string;

    constructor(body: any) {
        super();
        const {
            email,
            password,
        } = body;
        this.email = email;
        this.password = password;
    }
}

export class VerifyOtpModel extends Model {
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public otp: string;

    constructor(body: any) {
        super();
        const {
            email,
            otp,
        } = body;

        this.email = email;
        this.otp = otp;
    }
}

export class ForgotPasswordModel extends Model {
    @IsNotEmpty()
    public email: string;

    constructor(body: any) {
        super();
        const {
            email,
        } = body;

        this.email = email;
    }
}

export class ResetPasswordModel extends Model {
    @IsNotEmpty()
    public token: string;

    @IsNotEmpty()
    @Validate(IsPasswordMatchesRequirementsConstraint, {
        message: "PASSWORD_WARNING",
    })
    public password: string;

    constructor(body: any) {
        super();
        const {
            token,
            password,
        } = body;

        this.token = token;
        this.password = password;
    }
}
