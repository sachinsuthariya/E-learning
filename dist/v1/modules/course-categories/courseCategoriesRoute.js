"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCategoriesRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const courseCategoriesModel_1 = require("./courseCategoriesModel");
const courseCategoriesController_1 = require("./courseCategoriesController");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const courseCategoriesController = new courseCategoriesController_1.CourseCategoriesController();
const middleware = new middleware_1.Middleware();
// categories routes
router.post("/", v.validate(courseCategoriesModel_1.CourseCategoriesModel), courseCategoriesController.create); // for internal use only
router.put("/:id", v.validate(courseCategoriesModel_1.CourseCategoriesModel), courseCategoriesController.update);
router.put("/status/:id", courseCategoriesController.updateStatus);
router.delete("/:id", courseCategoriesController.delete);
router.patch("/:id", courseCategoriesController.restore);
router.get("/", courseCategoriesController.allCategories); // all categories
// Export the express.Router() instance to be used by server.ts
exports.CourseCategoriesRoute = router;
//# sourceMappingURL=courseCategoriesRoute.js.map