"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const middleware_1 = require("../../../middleware");
const validate_1 = require("../../../validate");
const authController_1 = require("./authController");
const authMiddleware_1 = require("./authMiddleware");
const authModel_1 = require("./authModel");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const authController = new authController_1.AuthController();
const authMiddleware = new authMiddleware_1.AuthMiddleware();
const middleware = new middleware_1.Middleware();
// authentication
router.post("/sign-up", v.validate(authModel_1.AuthModel), authController.signup); // for internal use only
router.post("/sign-in", v.validate(authModel_1.AuthenticationModel), authMiddleware.checkCredentials, authController.login);
router.post("/verify-account/:token", authController.verifyAccount);
router.post("/forgot-password", v.validate(authModel_1.ForgotPasswordModel), authController.forgotPassword);
router.post("/reset-password", v.validate(authModel_1.ResetPasswordModel), authController.resetPassword);
// profile
router.get("/profile", middleware.isAuthenticatedAdmin, authController.getProfile);
router.put("/profile", middleware.isAuthenticatedAdmin, authController.updateProfile);
// change password
router.post("/change-password", middleware.isAuthenticatedAdmin, authController.changePassword);
// Export the express.Router() instance to be used by server.ts
exports.AuthRoute = router;
//# sourceMappingURL=authRoute.js.map