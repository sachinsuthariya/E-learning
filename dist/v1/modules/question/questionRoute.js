"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const questionController_1 = require("./questionController");
const questionModel_1 = require("./questionModel");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const questionController = new questionController_1.QuestionController(); // Use the ExamController for exams
const middleware = new middleware_1.Middleware();
// exam routes
router.post("/", v.validate(questionModel_1.QuestionModel), questionController.create);
router.put("/:id", v.validate(questionModel_1.QuestionModel), questionController.update); // TODO: need improvement
// router.delete("/:id", questionController.delete);
router.get("/:id", questionController.getById);
router.get("/", questionController.allQuestions); // TODO: need improvement
// Export the express.Router() instance to be used by server.ts
exports.QuestionRoute = router;
//# sourceMappingURL=questionRoute.js.map