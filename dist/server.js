"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const bodyParser = require("body-parser"); // pull information from HTML POST (express4);
const busboy = require("connect-busboy");
const dotenv = require("dotenv");
const express = require("express");
// tslint:disable-next-line: no-var-requires
require("express-async-errors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet"); // Security
const l10n = require("jm-ez-l10n");
const morgan = require("morgan"); // log requests to the console (express4)
const database_1 = require("./database");
const logger_1 = require("./helpers/logger");
const routes_1 = require("./routes");
dotenv.config();
// initialize database
database_1.DB.init();
class App {
    constructor() {
        this.logger = logger_1.Log.getLogger();
        const NODE_ENV = process.env.NODE_ENV;
        const PORT = process.env.PORT;
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
            }
            else {
                next();
            }
        });
        l10n.setTranslationsFile("en", `src/language/translation.en.json`);
        this.app.use(l10n.enableL10NExpress);
        this.app.use(busboy({ immediate: true }));
        this.app.use(fileUpload({
            parseNested: true,
        }));
        this.app.use(morgan("dev"));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        // this.app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.json({ limit: '50mb' }), (error, req, res, next) => {
            if (error) {
                return res.status(400).json({ error: req.t("ERR_GENRIC_SYNTAX") });
            }
            next();
        });
        const routes = new routes_1.Routes(NODE_ENV);
        this.app.use("/api/v1", routes.path());
        const Server = this.app.listen(PORT, () => {
            this.logger.info(`The server is running in port localhost: ${process.env.PORT}`);
        });
    }
}
exports.App = App;
//# sourceMappingURL=server.js.map