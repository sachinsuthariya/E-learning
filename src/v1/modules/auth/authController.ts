import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { AuthUtils } from "./authUtils";
import { Utils } from "../../../helpers/utils";

export class AuthController {
    private authUtils: AuthUtils = new AuthUtils();

    public signup = async (req: any, res: Response) => {
        try {
            req.body.id = Utils.generateUUID();
            // encrypt password
            req.body.password = bcryptjs.hashSync(req.body.password.toString(), Constants.PASSWORD_HASH);

            const result = await this.authUtils.createAdmin(req.body);
            // JWT token
            const userDetails = {
                token: Jwt.getAuthToken({ id: result.id }),
                email: req.body.email,
            };
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), userDetails);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // Admin login
    public login = async (req: any, res: Response) => {
        try {
            const data = {
                token: Jwt.getAuthToken({ id: req.body._authentication.id }),
                id: req.body._authentication.id,
                firstName: req.body._authentication.firstName,
                lastName: req.body._authentication.lastName,
                mobile: req.body._authentication.mobile,
                email: req.body._authentication.email,
            };
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_LOGIN"), data);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // forgot password
    public forgotPassword = async (req: any, res: Response) => {
    }

    // reset password
    public resetPassword = async (req: any, res: Response) => {

    }

    // profile
    // get profile
    public getProfile = async (req: any, res: Response) => {
        try {
            delete req.user.password;
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), req.user);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // update profile
    public updateProfile = async (req: any, res: Response) => {
        try {
            await this.authUtils.updateAdminDetails(req.body, req.user.id);
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_UPDATE_PROFILE"));
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // change password
    public changePassword = async (req: any, res: Response) => {
        try {
            const userId = req.user.id;
            const {
                oldPassword,
                newPassword,
            } = req.body;
            const userData = await this.authUtils.getUserById(userId);
            const passCheck = await bcryptjs.compare(oldPassword, userData.password);
            if (passCheck) {
                const data = {
                    password: bcryptjs.hashSync(newPassword.toString(), Constants.PASSWORD_HASH),
                };
                await this.authUtils.updateAdminDetails(data, userId);
                const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CHANGE_PASSWORD"));
                return res.status(response.code).json(response);
            }
            const response = ResponseBuilder.genErrorResponse(Constants.FAIL_CODE, req.t("ERR_INVALID_PASSWORD"));
            return res.status(response.error.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }


}