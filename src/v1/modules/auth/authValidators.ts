import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";

@ValidatorConstraint({ async: false })
export class IsPasswordMatchesRequirementsConstraint implements ValidatorConstraintInterface {
    public validate(password: string, args: ValidationArguments) {
        /* ==*password validator regex*==
         should have one uppercase,
         one lowercase,
         min length should be 6,
         max length should be 30
         no white space allowed*/
        const regex = new RegExp("^(?!.* )(?=.*?[A-Z])(?=.*?[a-z]).{6,30}$");
        return regex.test(password);
    }
}

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {

    public async validate(email: string, args: ValidationArguments) {
        const user = await My.first(Tables.USER, ["id"], "email = ?", [email]);
        return user ? false : true;
    }
}

@ValidatorConstraint({ async: true })
export class IsMobileAlreadyExistConstraint implements ValidatorConstraintInterface {
    public async validate(mobile: string) {
        const user = await My.first(Tables.USER, ['id'], "mobile = ?", [mobile])        
        return user ? false : true;
    }
}
