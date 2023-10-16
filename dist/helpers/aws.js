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
exports.Aws = void 0;
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const fs = require("fs");
const uuid = require("node-uuid");
const constants_1 = require("../config/constants");
const logger_1 = require("./logger");
const Q = require("q");
dotenv.config();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: process.env.AWS_SIGNATURE_VERSION,
});
const s3 = new AWS.S3();
const sns = new AWS.SNS({
    region: process.env.SnsAwsRegion,
});
class Aws {
    uploadImage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeToFolder = constants_1.Constants.aws.userImage || "user";
            const ext = file.name.split(";")[0].split("/")[1] || "jpg";
            const key = `${storeToFolder}/${uuid.v1()}.${ext}`;
            const putObject = yield this.s3PutObject(file, key);
            if (!putObject) {
                return {
                    key,
                    url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
                };
            }
            else {
                return false;
            }
        });
    }
    s3PutObject(file, key) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.readFile(file.path, (error, fileContent) => {
                if (error) {
                    return false;
                }
                const params = {
                    // ACL: 'public-read',
                    Body: fileContent,
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    ContentDisposition: "inline",
                    ContentType: file.type || file.mime,
                    Key: key,
                };
                s3.putObject(params, (err) => {
                    if (err) {
                        return false;
                    }
                    return {
                        key,
                        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
                    };
                });
            });
        });
    }
    static publishSnsSMS(to, message) {
        const deferred = Q.defer();
        const params = {
            Message: message,
            MessageStructure: "string",
            PhoneNumber: to,
        };
        const paramsAtt = {
            attributes: {
                DefaultSMSType: "Transactional",
                DefaultSenderID: "e-learning",
            },
        };
        sns.setSMSAttributes(paramsAtt, (err, data) => {
            if (err) {
                Aws.logger.error(err, err.stack);
            }
            else {
                Aws.logger.debug(data);
                sns.publish(params, (snsErr, snsData) => {
                    if (snsErr) {
                        // an error occurred
                        Aws.logger.error(snsErr);
                        deferred.reject(snsErr);
                    }
                    else {
                        // successful response
                        // logger.debug(data);
                        deferred.resolve(snsData);
                    }
                });
            }
        });
        return deferred.promise;
    }
}
exports.Aws = Aws;
Aws.logger = logger_1.Log.getLogger();
//# sourceMappingURL=aws.js.map