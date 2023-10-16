"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const middleware_1 = require("../../../middleware");
const validate_1 = require("../../../validate");
const userController_1 = require("./userController");
const userModel_1 = require("./userModel");
const router = express_1.Router();
const v = new validate_1.Validator();
const userController = new userController_1.UserController();
const middleware = new middleware_1.Middleware();
// User Routes
router.post("/", v.validate(userModel_1.UserModel), userController.createUser); // Create User
router.put("/:id", userController.updateUser); // Update User
router.put("/status/:id", userController.updateUserStatus); // Update User Status
router.delete("/:id", userController.deleteUser); // Delete User
router.patch("/:id", userController.restoreUser); // Restore User
router.get("/:id", userController.getUserById); // Get User by ID
router.get("/", userController.getAllUsers); // Get All Users
exports.UserRoute = router;
//# sourceMappingURL=userRoute.js.map