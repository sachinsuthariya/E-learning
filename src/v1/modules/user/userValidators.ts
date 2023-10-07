import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {

    public async validate(email: string, args: ValidationArguments) {
        const user = await My.first(Tables.USER, ["id"], "email = ?", [email]);
        return user ? false : true;
    }
}
