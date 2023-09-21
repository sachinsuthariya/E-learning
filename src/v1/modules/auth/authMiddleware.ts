import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../../config/constants";
import { AuthUtils } from "./authUtils";

export class AuthMiddleware {
    private authUtils: AuthUtils = new AuthUtils();

    public checkCredentials = async (req: any, res: Response, next: () => void) => {

        // get user detail by email address
        const admin = await this.authUtils.checkAdminEmailExists(req.body.email);

        // check credentials matches or not
        if (admin &&
            await bcryptjs.compare(req.body.password, admin.password)) {
            req.body._authentication = admin;
            next();
        } else {
            return res.status(Constants.UNAUTHORIZED_CODE).json(
                { error: req.t("INVALID_CREDENTIALS"), code: Constants.UNAUTHORIZED_CODE },
            );
        }
    }
}
