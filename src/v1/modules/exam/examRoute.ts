// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { ExamModel } from "./examModel";
import { ExamController } from "./examController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const examController = new ExamController(); // Use the ExamController for exams
const middleware = new Middleware();


// exam routes
router.post("/", v.validate(ExamModel), examController.create);
router.put("/:id", v.validate(ExamModel), examController.update);
// router.delete("/:id", examController.delete);
router.get("/:id", examController.getById);
router.get("/", examController.allExams);

// get exam question
router.get("/:id/questions", examController.getExamQuestions)
router.post("/:id/:questionId/answer", examController.submitAnswer)

//get exam result 
router.get("/:id/:userId/result", examController.getExamResult)

// Export the express.Router() instance to be used by server.ts
export const ExamRoute: Router = router;
