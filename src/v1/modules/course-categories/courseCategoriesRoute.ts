// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { CourseCategoriesModel } from "./courseCategoriesModel";
import { CourseCategoriesController } from "./courseCategoriesController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const courseCategoriesController = new CourseCategoriesController();
const middleware = new Middleware();

// categories routes
router.post("/", middleware.isAuthenticated, v.validate(CourseCategoriesModel), courseCategoriesController.create); // for internal use only
router.put("/:id", middleware.isAuthenticated, v.validate(CourseCategoriesModel), courseCategoriesController.update);
router.put("/status/:id", middleware.isAuthenticated, courseCategoriesController.updateStatus);
router.delete("/:id", middleware.isAuthenticated, courseCategoriesController.delete);
router.patch("/:id", middleware.isAuthenticated, courseCategoriesController.restore);
router.get("/", middleware.isAuthenticatedUser, courseCategoriesController.allCategories); // all categories
router.get("/:id", middleware.isAuthenticatedUser, courseCategoriesController.getById); // all categories

// Export the express.Router() instance to be used by server.ts
export const CourseCategoriesRoute: Router = router;
