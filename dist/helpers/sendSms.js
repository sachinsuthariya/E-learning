"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendSMS = void 0;
const path = require("path");
const EmailTemplate = require("email-templates-v2");
const aws_1 = require("./aws");
const logger_1 = require("./logger");
class SendSMS {
}
exports.SendSMS = SendSMS;
SendSMS.sendSms = (to, templateName, data) => {
    try {
        const templatesDir = path.resolve(`${__dirname}/../`, "templates");
        const content = `${templatesDir}/${templateName}.html`;
        const template = new EmailTemplate(content);
        template.render(data, (err, result) => {
            if (!err) {
                const { text } = result;
                aws_1.Aws.publishSnsSMS(to, text)
                    .then((done) => {
                    // if (sendPassword) { sendPasswordSms(to, data.password); }
                    SendSMS.logger.info(done);
                })
                    .catch((publishErr) => {
                    SendSMS.logger.error(publishErr);
                });
            }
            else {
                SendSMS.logger.error(err);
            }
        });
    }
    catch (err) {
        SendSMS.logger.error(err);
    }
};
SendSMS.logger = logger_1.Log.getLogger();
//# sourceMappingURL=sendSms.js.map