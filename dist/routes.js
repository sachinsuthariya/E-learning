"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express = require("express");
const l10n = require("jm-ez-l10n");
const middleware_1 = require("./middleware");
const authRoute_1 = require("./v1/modules/auth/authRoute");
const userRoute_1 = require("./v1/modules/user/userRoute");
const dashboardRoute_1 = require("./v1/modules/dashboard/dashboardRoute");
const currentAffairsRoute_1 = require("./v1/modules/current-affairs/currentAffairsRoute");
const courseCategoriesRoute_1 = require("./v1/modules/course-categories/courseCategoriesRoute");
const courseRoute_1 = require("./v1/modules/course/courseRoute");
const examRoute_1 = require("./v1/modules/exam/examRoute");
const questionRoute_1 = require("./v1/modules/question/questionRoute");
const bookRoute_1 = require("./v1/modules/book/bookRoute");
class Routes {
    constructor(NODE_ENV) {
        switch (NODE_ENV) {
            case "production":
                this.basePath = "/app/dist";
                break;
            case "development":
                this.basePath = "/app/public";
                break;
        }
    }
    defaultRoute(req, res) {
        res.json({
            message: "Hello !",
        });
    }
    path() {
        const router = express.Router();
        const middleware = new middleware_1.Middleware();
        router.use("/auth", authRoute_1.AuthRoute);
        router.use("/user", userRoute_1.UserRoute);
        router.use("/dashboard", dashboardRoute_1.DashboardRoute);
        router.use("/current-affairs", currentAffairsRoute_1.CurrentAffairsRoute);
        router.use("/course-categories", courseCategoriesRoute_1.CourseCategoriesRoute);
        router.use("/course", courseRoute_1.CourseRoute);
        router.use("/exam", examRoute_1.ExamRoute);
        router.use("/question", questionRoute_1.QuestionRoute);
        router.use("/book", bookRoute_1.BookRoute);
        router.all("/*", (req, res) => {
            return res.status(404).json({
                error: l10n.t("ERR_URL_NOT_FOUND"),
            });
        });
        return router;
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map
