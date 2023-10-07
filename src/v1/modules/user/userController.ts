import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { UserUtils } from "./userUtils";
import { Utils } from "../../../helpers/utils";

export class UserController {
    private userUtils: UserUtils = new UserUtils();

    public create = async (req: any, res: Response) => {
        try {
            req.body.id = Utils.generateUUID();
            await this.userUtils.create(req.body);
            const user = await this.userUtils.getById(req.body.id)
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), user);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public getById = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const currentAffair = await this.userUtils.getById(id);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffair);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public allUsers = async (req: any, res: Response) => {
        try {
            const getAllUsers = await this.userUtils.getAllUsers();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllUsers);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public delete = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const currentAffair = await this.userUtils.destroy(id);

            if (!currentAffair || !currentAffair.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                return res.status(response.code).json(response);                
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CURRENT_AFFAIR_DELETE"));
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public restore = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const currentAffair = await this.userUtils.restoreCurrentAffair(id);

            if (!currentAffair || !currentAffair.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                return res.status(response.code).json(response);                
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CURRENT_AFFAIR_RESTORE"));
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public update = async (req: any, res: Response) => {
        try {
            const currentAffairId = req.params.id;
            const currentAffairDetails = {
                title: req.body.title,
                content: req.body.content,
                status: req.body.status
            }

            const updateUser = await this.userUtils.updateById(currentAffairId, currentAffairDetails);
            
            if (!updateUser || !updateUser.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const user = await this.userUtils.getById(currentAffairId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), user);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    };
    
    public updateStatus = async (req: any, res: Response) => {
        try {
            const currentAffairId = req.params.id;
            const currentAffairDetails = {
                status: req.body.status
            }

            const updateUser = await this.userUtils.updateById(currentAffairId, currentAffairDetails);
            
            if (!updateUser || !updateUser.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const user = await this.userUtils.getById(currentAffairId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), user);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    };

}
