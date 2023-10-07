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
router.post("/", v.validate(UserModel), userController.createUser); // Create User
router.put("/:id", userController.updateUser); // Update User
router.put("/status/:id", userController.updateUserStatus); // Update User Status
router.delete("/:id", userController.deleteUser); // Delete User
router.patch("/:id", userController.restoreUser); // Restore User
router.get("/:id", userController.getUserById); // Get User by ID
router.get("/", userController.getAllUsers); // Get All Users

export const UserRoute: Router = router;
