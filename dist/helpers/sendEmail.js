"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = void 0;
const aws = require("aws-sdk");
const fs = require("fs");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const path = require("path");
const constants_1 = require("../config/constants");
const logger_1 = require("./logger");
aws.config.update({
    // accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
class SendEmail {
}
exports.SendEmail = SendEmail;
SendEmail.sendRawMail = (template = null, replaceData = null, emails, subject, text = null, isPersonalEmail = false) => {
    try {
        let html = "";
        if (template) {
            // send email for verification
            const templatesDir = path.resolve(`${__dirname}/../`, "templates");
            const content = `${templatesDir}/${template}.html`;
            html = SendEmail.getHtmlContent(content, replaceData);
        }
        const mailOptions = {
            from: process.env.DEFAULT_FROM,
            html,
            replyTo: process.env.DEFAULT_REPLY_TO,
            subject,
            to: !isPersonalEmail ? emails : [],
            bcc: isPersonalEmail ? emails : [],
            text,
        };
        let transportObj = {};
        const envChecks = process.env.ENV_CHECKS_FOR_MAIL.split(",");
        if (envChecks.includes(process.env.NODE_ENV.toLowerCase())) {
            transportObj = {
                SES: new aws.SES({
                    apiVersion: constants_1.Constants.SES_API_VERSION,
                    region: process.env.AWS_REGION,
                }),
            };
        }
        else {
            transportObj = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER_NAME,
                    pass: process.env.SMTP_PASSWORD,
                },
            };
            console.log("transport obj =>", transportObj);
        }
        const transporter = nodemailer.createTransport(transportObj);
        transporter.sendMail(mailOptions, (mailSendErr, info) => {
            if (!mailSendErr) {
                SendEmail.logger.info(`Message sent: ${info.response}`);
            }
            else {
                SendEmail.logger.error(`Error in sending email: ${mailSendErr} and info ${info}`);
            }
        });
    }
    catch (err) {
        console.log("email err =>", err);
        SendEmail.logger.error(err);
    }
};
SendEmail.logger = logger_1.Log.getLogger();
// Just reading html file and then returns in string
SendEmail.getHtmlContent = (filePath, replaceData) => {
    const data = fs.readFileSync(filePath);
    let html = data.toString();
    _.keys(replaceData).forEach((key) => {
        html = html.replace(key, replaceData[key]);
    });
    return html;
};
//# sourceMappingURL=sendEmail.js.map