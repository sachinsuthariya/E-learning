// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { AppUpdateModel } from "./appUpdateModel";
import { AppUpdateController } from "./appUpdateController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const appUpdateController = new AppUpdateController();
const middleware = new Middleware();

// app advertisement routes
router.post("/", middleware.isAuthenticated, v.validate(AppUpdateModel), appUpdateController.create); // for internal use only
router.delete("/:id", middleware.isAuthenticated, appUpdateController.delete);
router.get("/", appUpdateController.allAppUpdate); // all app advertisement
router.post("/upload-files", middleware.isAuthenticatedUser, appUpdateController.uploadFiles)

// Export the express.Router() instance to be used by server.ts
export const AppUpdateRoute: Router = router;
