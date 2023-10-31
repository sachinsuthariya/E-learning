// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../../middleware";
import { Validator } from "../../../validate";
import { AuthController } from "./authController";
import { AuthMiddleware } from "./authMiddleware";
import { AuthModel, AuthenticationModel, ForgotPasswordModel, ResetPasswordModel } from "./authModel";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();
const middleware = new Middleware();

// authentication
router.post("/sign-up", v.validate(AuthModel), authController.signup); // for internal use only
router.post("/sign-in", v.validate(AuthenticationModel), authMiddleware.checkCredentials, authController.login);
router.post("/verify-account/:token", authController.verifyAccount)
router.post("/forgot-password", v.validate(ForgotPasswordModel), authController.forgotPassword);
router.post("/reset-password", v.validate(ResetPasswordModel), authController.resetPassword);

// profile
router.get("/profile", middleware.isAuthenticatedUser, authController.getProfile);
router.put("/profile", middleware.isAuthenticatedUser, authController.updateProfile);
// change password
router.post("/change-password", middleware.isAuthenticatedUser, authController.changePassword);


// Export the express.Router() instance to be used by server.ts
export const AuthRoute: Router = router;
