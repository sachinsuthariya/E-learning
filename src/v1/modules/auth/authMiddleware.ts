import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../../config/constants";
import { AuthUtils } from "./authUtils";
import { UserStatus } from "../../../config/enums";

export class AuthMiddleware {
    private authUtils: AuthUtils = new AuthUtils();

    public checkCredentials = async (req: any, res: Response, next: () => void) => {
        // get user detail by email address
        const user = await this.authUtils.checkEmailExists(req.body.email);

        // check credentials matches or not
        if (user && await bcryptjs.compare(req.body.password, user.password)) {
            
            if (user.status && user.status != UserStatus.ACTIVE) {
                return res.status(Constants.UNAUTHORIZED_CODE).json(
                    { error: req.t("ERR_ACCOUNT_NOT_ACTIVE"), code: Constants.UNAUTHORIZED_CODE },
                );
            }
            if (!user.emailVerified) {
                return res.status(Constants.UNAUTHORIZED_CODE).json(
                    { error: req.t("ACCOUNT_NOT_VERIFIED_ERR"), code: Constants.UNAUTHORIZED_CODE },
                );
            }
            req.body._authentication = user;
            next();
        } else {
            return res.status(Constants.UNAUTHORIZED_CODE).json(
                { error: req.t("INVALID_CREDENTIALS"), code: Constants.UNAUTHORIZED_CODE },
            );
        }
    }
}
