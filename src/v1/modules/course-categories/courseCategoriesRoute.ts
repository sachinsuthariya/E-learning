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
router.post("/", v.validate(CourseCategoriesModel), courseCategoriesController.create); // for internal use only
router.put("/:id", v.validate(CourseCategoriesModel), courseCategoriesController.update);
router.put("/status/:id", courseCategoriesController.updateStatus);
router.delete("/:id", courseCategoriesController.delete);
router.patch("/:id", courseCategoriesController.restore);
router.get("/", courseCategoriesController.allCategories); // all categories

// Export the express.Router() instance to be used by server.ts
export const CourseCategoriesRoute: Router = router;
