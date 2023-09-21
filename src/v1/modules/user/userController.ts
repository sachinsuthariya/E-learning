import { Request, Response } from "express";
import { Constants } from "../../../config/constants";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { UserUtils } from "./userUtils";

export class UserController {
    private userUtils: UserUtils = new UserUtils();

    // get user list
    public getUserList = async (req: any, res: Response) => {
        try {
            const data = await this.userUtils.getUserList(req.query);

            if (data && data.list.length) {
                const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), data);
                return res.status(response.code).json(response);
            }
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("NO_DATA_FOUND"));
            return res.status(response.code).json(response);
        } catch (err) {
            console.log('err', err);

            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // update user status & detail
    public updateUserProfile = async (req: any, res: Response) => {
        try {
            const userId = req.params.userId;
            await this.userUtils.updateUserDetails(req.body, userId);
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_UPDATE_USER_STATUS"), req.user);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // get user detail
    public getUserDetail = async (req: any, res: Response) => {
        try {
            const data = await this.userUtils.getUserDetails(req.params.userId);
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), data);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // delete user
    public deleteUser = async (req: any, res: Response) => {
        try {
            const userId = req.params.userId;
            const data = {
                isDelete: true,
            };
            await this.userUtils.updateUserDetails(data, userId);
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_DELETE_USER"), req.user);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
}  