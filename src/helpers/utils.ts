import { Url } from "aws-sdk/clients/cloudformation";
import * as moment from "moment";
import { parse } from "node-html-parser";
import * as request from "request";
import { Constants } from "../config/constants";
import { Log } from "../helpers/logger";
import { v4 as uuidv4 } from 'uuid';

export class Utils {
  private static logger: any = Log.getLogger();

  public static generateUUID = () => uuidv4(); // generate uuid

  public static createRandomcode = (length: number, isOTP: boolean) => {
    let code = "";
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // for referral code generator
    if (isOTP) {
      characters = "0123456789"; // for otp generator
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  }

  public static getStandardDateFormatWithAddedMinutes = (value: number) => {
    return moment().add(value, "minutes").format(Constants.DATE_TIME_FORMAT);
  }

  /** get skip and limit to avoid multiple code lines */
  public static getSkipLimit = (page: number, recordsPerPage: number = null) => {
    let skip = 0;
    const limit = recordsPerPage ? recordsPerPage : Constants.RECORDS_PER_PAGE; // for paginate records
    if (page) {
      skip = (page - 1) * limit;
    }
    return { limit, skip };
  }

  public static uploadedFolder = (type) => {
    let storeToFolder;
    return storeToFolder;
  }

  /* Get image path for attachment */
  public static getImagePath = (atchId: string, atchName: string) => {
    return `IF(${atchId} IS NULL, '', CONCAT('${process.env.MEDIA_SERVER_PATH}', ${atchName}))`;
  }

  /* Get round of 2 digit */
  public static getRoundOfTwoDigit = (value: number) => {
    return +value.toFixed(2);
  }

  public static getTextFromHTML = (HTMLString: string) => {
    return parse(HTMLString).removeWhitespace().text
  }

  public static callApi = async (method: string, url: Url, headers: object, bodyData: object) => {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        json: true,
      };
      if (method === 'POST' || method === 'PUT') {
        // tslint:disable-next-line: no-string-literal
        options['body'] = bodyData;
      }
      request(options, (error, response, resBody) => {
        Utils.logger.debug(`Requested url: ${url} and options:`, options);
        if (error) {
          Utils.logger.error('[Error in calling third party api from request]', error);
          return reject(error);
        } else if (response.statusCode !== Constants.SUCCESS_CODE) {
          Utils.logger.error(`[Error third party api responded] Status code: ${response.statusCode}`, resBody);
          const errorMsg = {
            isError: true,
            code: response.statusCode,
            error: resBody || { code: Constants.INTERNAL_SERVER_ERROR_CODE, error: 'internal server error' },
            statusCode: response.statusCode,
          };
          return resolve(errorMsg);
        }
        Utils.logger.debug('[Success in calling third party api from request]');
        return resolve(resBody);
      });
    });
  }

  // pagination
  public static pagination = (total, limit) => {
    const pages = Math.ceil(total / (limit || total));
    return {
      pages: pages || 1,
      total,
      max: limit || total,
    };
  }

}
