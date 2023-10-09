
import { IsNotEmpty, IsString, IsEmail, Matches, Validate } from "class-validator";
import { IsEmailAlreadyExistConstraint } from "./userValidators";
import { Model } from "../../../model";

export class UserModel extends Model {

    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @IsNotEmpty()
    @IsString()
    public lastName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{10}$/)
    public mobile: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Invalid email format" })
    @Validate(IsEmailAlreadyExistConstraint, {
        message: "ERR_EMAIL_ALREADY_EXISTS",
    })
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?!.* )(?=.*?[A-Z])(?=.*?[a-z]).{6,30}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long" })
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