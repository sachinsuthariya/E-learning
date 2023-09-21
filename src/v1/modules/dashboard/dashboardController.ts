import { Request, Response } from "express";
import { Constants } from "../../../config/constants";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { DashboardUtils } from "./dashboardUtils";

export class DashboardController {
    private dashboardUtils: DashboardUtils = new DashboardUtils();

    // dashboard API's
    public getTotalData = async (req: any, res: Response) => {
        try {
            const data = await this.dashboardUtils.getTotalData();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), data);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

}