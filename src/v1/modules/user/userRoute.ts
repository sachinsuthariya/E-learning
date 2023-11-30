// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../../middleware";
import { Validator } from "../../../validate";
import { UserController } from "./userController";
import { UserModel } from "./userModel";

const router: Router = Router();
const v: Validator = new Validator();
const userController = new UserController();
const middleware = new Middleware();

// User Routes
router.post("/", middleware.isAuthenticated, v.validate(UserModel), userController.createUser); // Create User
router.put("/:id", middleware.isAuthenticated, userController.updateUser); // Update User
router.put("/status/:id", middleware.isAuthenticated, userController.updateUserStatus); // Update User Status
router.delete("/:id", middleware.isAuthenticated, userController.deleteUser); // Delete User
router.patch("/:id", middleware.isAuthenticated, userController.restoreUser); // Restore User
router.get("/students", middleware.isAuthenticated, userController.getAllStudents); // Get All Students
router.get("/:id", middleware.isAuthenticatedUser, userController.getUserById); // Get User by ID
router.get("/", middleware.isAuthenticated, userController.getAllUsers); // Get All Users

export const UserRoute: Router = router;
