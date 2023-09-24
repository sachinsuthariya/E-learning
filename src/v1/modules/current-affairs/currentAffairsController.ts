import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { CurrentAffairsUtils } from "./currentAffairsUtils";
import { Utils } from "../../../helpers/utils";

export class CurrentAffairsController {
    private currentAffairsUtils: CurrentAffairsUtils = new CurrentAffairsUtils();

    public create = async (req: any, res: Response) => {
        try {
            req.body.id = Utils.generateUUID();
            await this.currentAffairsUtils.create(req.body);
            const currentAffairs = await this.currentAffairsUtils.getById(req.body.id)
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffairs);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public getById = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const currentAffair = await this.currentAffairsUtils.getById(id);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffair);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public allCurrentAffairs = async (req: any, res: Response) => {
        try {
            const getAllCurrentAffairs = await this.currentAffairsUtils.getAllCurrentAffairs();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllCurrentAffairs);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public delete = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const currentAffair = await this.currentAffairsUtils.destroy(id);

            if (!currentAffair || !currentAffair.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                return res.status(response.code).json(response);                
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CURRENT_AFFAIR_DELETE"));
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
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

            const updateCurrentAffairs = await this.currentAffairsUtils.updateById(currentAffairId, currentAffairDetails);
            
            if (!updateCurrentAffairs || !updateCurrentAffairs.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const currentAffairs = await this.currentAffairsUtils.getById(currentAffairId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffairs);
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

            const updateCurrentAffairs = await this.currentAffairsUtils.updateById(currentAffairId, currentAffairDetails);
            
            if (!updateCurrentAffairs || !updateCurrentAffairs.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const currentAffairs = await this.currentAffairsUtils.getById(currentAffairId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffairs);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    };

}
