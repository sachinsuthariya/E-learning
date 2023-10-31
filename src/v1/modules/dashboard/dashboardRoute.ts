// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../../middleware";
import { Validator } from "../../../validate";
import { DashboardController } from "./dashboardController";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const dashboardController = new DashboardController();
const middleware = new Middleware();

// dashboard
router.get("/total-data", middleware.isAuthenticated, dashboardController.getTotalData);

// Export the express.Router() instance to be used by server.ts
export const DashboardRoute: Router = router;
