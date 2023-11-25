// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { AppAdvertiseModel } from "./appAdvertiseModel";
import { AppAdvertiseController } from "./appAdvertiseController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const appAdvertiseController = new AppAdvertiseController();
const middleware = new Middleware();

// app advertisement routes
router.post("/", middleware.isAuthenticated, v.validate(AppAdvertiseModel), appAdvertiseController.create); // for internal use only
router.delete("/:id", middleware.isAuthenticated, appAdvertiseController.delete);
router.get("/", appAdvertiseController.allAppAdvertise); // all app advertisement
router.post("/upload-files", middleware.isAuthenticatedUser, appAdvertiseController.uploadFiles)

// Export the express.Router() instance to be used by server.ts
export const AppAdvertiseRoute: Router = router;
