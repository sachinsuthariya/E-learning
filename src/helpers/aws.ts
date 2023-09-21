import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as uuid from "node-uuid";
import { Constants } from "../config/constants";
import { Log } from "./logger";
import * as Q from "q";

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: process.env.AWS_SIGNATURE_VERSION,
});

const s3: AWS.S3 = new AWS.S3();
const sns = new AWS.SNS({
    region: process.env.SnsAwsRegion,
  });

export class Aws {
    public async uploadImage(file) {
        const storeToFolder = Constants.aws.userImage || "user";
        const ext = file.name.split(";")[0].split("/")[1] || "jpg";
        const key = `${storeToFolder}/${uuid.v1()}.${ext}`;
        const putObject: any = await this.s3PutObject(file, key);
        if (!putObject) {
            return {
                key,
                url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
            };
        } else {
            return false;
        }
    }

    public async s3PutObject(file, key) {
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
    }

    public static publishSnsSMS(to, message) {
        const deferred = Q.defer();
        const params = {
          Message: message,
          MessageStructure: "string",
          PhoneNumber: to,
        };
      
        const paramsAtt = {
          attributes: { /* required */
            DefaultSMSType: "Transactional",
            DefaultSenderID: "e-learning",
          },
        };
      
        sns.setSMSAttributes(paramsAtt, (err, data) => {
          if (err) {
            Aws.logger.error(err, err.stack);
          } else {
            Aws.logger.debug(data);
            sns.publish(params, (snsErr, snsData) => {
              if (snsErr) {
                // an error occurred
                Aws.logger.error(snsErr);
                deferred.reject(snsErr);
              } else {
                // successful response
                // logger.debug(data);
                deferred.resolve(snsData);
              }
            });
          }
        });
      
        return deferred.promise;
    }

    private static logger: any = Log.getLogger();
}
