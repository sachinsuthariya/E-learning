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
            console.log(req.body);
            await this.currentAffairsUtils.create(req.body);
            const currentAffairs = await this.currentAffairsUtils.getById(req.body.id)
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), currentAffairs);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

}