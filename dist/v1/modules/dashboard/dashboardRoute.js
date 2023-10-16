"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const middleware_1 = require("../../../middleware");
const validate_1 = require("../../../validate");
const dashboardController_1 = require("./dashboardController");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const dashboardController = new dashboardController_1.DashboardController();
const middleware = new middleware_1.Middleware();
// dashboard
router.get("/total-data", middleware.isAuthenticatedAdmin, dashboardController.getTotalData);
// Export the express.Router() instance to be used by server.ts
exports.DashboardRoute = router;
//# sourceMappingURL=dashboardRoute.js.map