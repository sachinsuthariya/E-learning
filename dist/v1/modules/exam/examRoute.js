"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const examModel_1 = require("./examModel");
const examController_1 = require("./examController");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const examController = new examController_1.ExamController(); // Use the ExamController for exams
const middleware = new middleware_1.Middleware();
// exam routes
router.post("/", v.validate(examModel_1.ExamModel), examController.create);
router.put("/:id", v.validate(examModel_1.ExamModel), examController.update);
// router.delete("/:id", examController.delete);
router.get("/list", middleware.isAuthenticatedStudent, examController.allExams);
router.get("/", examController.allExams);
// enrollment user for exam routes
router.put("/:id/enroll-exam", middleware.isAuthenticatedStudent, examController.enrollExamUser);
router.get("/enrolled", middleware.isAuthenticatedStudent, examController.enrolledExams);
// get exam question
router.get("/:id/questions", middleware.isAuthenticatedStudent, examController.getExamQuestions);
router.post("/:id/:questionId/answer", middleware.isAuthenticatedStudent, examController.submitAnswer);
//get exam result 
router.get("/:id/:userId/result", middleware.isAuthenticatedStudent, examController.getExamResult);
router.get("/:id", examController.getById);
// Export the express.Router() instance to be used by server.ts
exports.ExamRoute = router;
//# sourceMappingURL=examRoute.js.map