"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const courseModel_1 = require("./courseModel");
const courseController_1 = require("./courseController");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const courseController = new courseController_1.CourseController();
const middleware = new middleware_1.Middleware();
// course routes
router.post("/", v.validate(courseModel_1.CourseModel), courseController.create); // for internal use only
router.put("/:id", v.validate(courseModel_1.CourseModel), courseController.update);
router.put("/status/:id", courseController.updateStatus);
router.delete("/:id", courseController.delete);
router.patch("/:id", courseController.restore);
router.get("/:id", courseController.getById);
router.get("/", courseController.allCourses); // all Courses
// Export the express.Router() instance to be used by server.ts
exports.CourseRoute = router;
//# sourceMappingURL=courseRoute.js.map