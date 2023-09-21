import * as l10n from "jm-ez-l10n";
import { Constants } from "../config/constants";


export class ResponseBuilder {

  public static genErrorResponse(code, errMsg) {
    const response = {
      error: {
        code,
        message: errMsg,
      },
    };
    return response;
  }

  public static genSuccessResponse(code, message, data = null) {
    const response = {
      status: true,
      code,
      data,
      message,
    };
    return response;
  }

  public code: number;
  public msg: string;
  public error: string;
  public result: any;
  public description: string;
}
