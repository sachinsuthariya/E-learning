// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../../middleware";
import { Validator } from "../../../validate";
import { UserController } from "./userController";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const userController = new UserController();
const middleware = new Middleware();

// user module
router.get("/user-list", middleware.isAuthenticatedAdmin, userController.getUserList);
router.put("/user-profile/:userId", middleware.isAuthenticatedAdmin, userController.updateUserProfile);
router.get("/user-profile/:userId", middleware.isAuthenticatedAdmin, userController.getUserDetail);
router.delete("/delete-user/:userId", middleware.isAuthenticatedAdmin, userController.deleteUser);

// Export the express.Router() instance to be used by server.ts
export const UserRoute: Router = router;
