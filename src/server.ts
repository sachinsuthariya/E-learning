import * as bodyParser from "body-parser"; // pull information from HTML POST (express4);
import * as busboy from "connect-busboy";
import * as dotenv from "dotenv";
import * as express from "express";
// tslint:disable-next-line: no-var-requires
require("express-async-errors");
import * as fileUpload from "express-fileupload";
import * as helmet from "helmet"; // Security
import * as l10n from "jm-ez-l10n";
import * as morgan from "morgan"; // log requests to the console (express4)
import { DB } from "./database";
import { Log } from "./helpers/logger";
import { Routes } from "./routes";
import * as path from "path";

dotenv.config();
// initialize database
DB.init();

export class App {
  protected app: express.Application;
  private logger = Log.getLogger();
  constructor() {
    const NODE_ENV = process.env.NODE_ENV;
    const PORT = process.env.PORT as string;
    this.app = express();
    this.app.use(helmet());
    this.app.all("/*", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Request-Headers", "*");
      // tslint:disable-next-line: max-line-length
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization, token, x-device-type, x-app-version, x-build-number, uuid,x-auth-token,X-L10N-Locale");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
      } else {
        next();
      }
    });
    l10n.setTranslationsFile("en", `src/language/translation.en.json`);
    this.app.use(l10n.enableL10NExpress);
    // this.app.use(busboy({ immediate: true }));
    this.app.use('/assets', express.static(path.join(__dirname, 'assets')));
    this.app.use('/uploads', express.static(path.join('uploads')));

    this.app.use(fileUpload({
      parseNested: true,
      createParentPath: true
    }));
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    // this.app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
    this.app.use(express.json({ limit: '50mb' }), (error, req, res, next) => {
      if (error) {
        console.log("err =>", error);
        
        return res.status(400).json({ error: req.t("ERR_GENRIC_SYNTAX") });
      }
      next();
    });

    const routes = new Routes(NODE_ENV);
    this.app.use("/api/v1", routes.path());
    const Server = this.app.listen(PORT, () => {
      this.logger.info(`The server is running in port localhost: ${process.env.PORT}`);
    });

  }
}
