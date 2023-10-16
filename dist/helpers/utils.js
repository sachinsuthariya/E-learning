"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const moment = require("moment");
const node_html_parser_1 = require("node-html-parser");
const request = require("request");
const constants_1 = require("../config/constants");
const logger_1 = require("../helpers/logger");
const uuid_1 = require("uuid");
class Utils {
}
exports.Utils = Utils;
Utils.logger = logger_1.Log.getLogger();
Utils.generateUUID = () => uuid_1.v4(); // generate uuid
Utils.createRandomcode = (length, isOTP) => {
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
};
Utils.getStandardDateFormatWithAddedMinutes = (value) => {
    return moment().add(value, "minutes").format(constants_1.Constants.DATE_TIME_FORMAT);
};
/** get skip and limit to avoid multiple code lines */
Utils.getSkipLimit = (page, recordsPerPage = null) => {
    let skip = 0;
    const limit = recordsPerPage ? recordsPerPage : constants_1.Constants.RECORDS_PER_PAGE; // for paginate records
    if (page) {
        skip = (page - 1) * limit;
    }
    return { limit, skip };
};
Utils.uploadedFolder = (type) => {
    let storeToFolder;
    return storeToFolder;
};
/* Get image path for attachment */
Utils.getImagePath = (atchId, atchName) => {
    return `IF(${atchId} IS NULL, '', CONCAT('${process.env.MEDIA_SERVER_PATH}', ${atchName}))`;
};
/* Get round of 2 digit */
Utils.getRoundOfTwoDigit = (value) => {
    return +value.toFixed(2);
};
Utils.getTextFromHTML = (HTMLString) => {
    return node_html_parser_1.parse(HTMLString).removeWhitespace().text;
};
Utils.callApi = (method, url, headers, bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            url,
            headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
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
            }
            else if (response.statusCode !== constants_1.Constants.SUCCESS_CODE) {
                Utils.logger.error(`[Error third party api responded] Status code: ${response.statusCode}`, resBody);
                const errorMsg = {
                    isError: true,
                    code: response.statusCode,
                    error: resBody || { code: constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, error: 'internal server error' },
                    statusCode: response.statusCode,
                };
                return resolve(errorMsg);
            }
            Utils.logger.debug('[Success in calling third party api from request]');
            return resolve(resBody);
        });
    });
});
// pagination
Utils.pagination = (total, limit) => {
    const pages = Math.ceil(total / (limit || total));
    return {
        pages: pages || 1,
        total,
        max: limit || total,
    };
};
//# sourceMappingURL=utils.js.map