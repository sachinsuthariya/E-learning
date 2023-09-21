import { Request, Response } from "express";
import * as _ from "lodash";
import { Constants } from "./config/constants";
import { Jwt } from "./helpers/jwt";
import { ResponseBuilder } from "./helpers/responseBuilder";
import { AuthUtils } from "./v1/modules/auth/authUtils";

export class Middleware {
  private authUtils: AuthUtils = new AuthUtils();

  public isAuthenticatedAdmin = async (req: any, res: Response, next: () => void) => {
    try {
      const token = req.headers["x-auth-token"];
      if (!token) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      const userData = Jwt.decodeAuthToken(token);
      if (!userData.id) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      req.user = await this.authUtils.getUserById(userData.id);
      next();
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
    }
  }
}
