import * as path from "path";
import * as EmailTemplate from "email-templates-v2";
import { Aws } from "./aws";
import * as _ from "lodash";
import { Log } from "./logger";


export class SendSMS {
    public static sendSms = (to: string, templateName: string, data: Json) => {
        try{
            const templatesDir = path.resolve(`${__dirname}/../`, "templates");
            const content = `${templatesDir}/${templateName}.html`;
            const template = new EmailTemplate(content);
            template.render(data, (err, result) => {
              if (!err) {
                const { text } = result;
                Aws.publishSnsSMS(to, text)
                  .then((done) => {
                    // if (sendPassword) { sendPasswordSms(to, data.password); }
                    SendSMS.logger.info(done);
                  })
                  .catch((publishErr) => {
                    SendSMS.logger.error(publishErr);
                  });
              } else {
                SendSMS.logger.error(err);
              }
            });
          } catch(err){
            SendSMS.logger.error(err);
        }
    }

    private static logger: any = Log.getLogger();
}