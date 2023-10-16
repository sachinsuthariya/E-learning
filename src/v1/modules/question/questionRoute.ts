// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { QuestionController } from "./questionController";
import { QuestionModel } from "./questionModel";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const questionController = new QuestionController(); // Use the ExamController for exams
const middleware = new Middleware();

// exam routes
router.post("/", v.validate(QuestionModel), questionController.create); 
router.put("/:id", v.validate(QuestionModel), questionController.update);  // TODO: need improvement
// router.delete("/:id", questionController.delete);
router.get("/:id", questionController.getById);
router.get("/", questionController.allQuestions); // TODO: need improvement

// Export the express.Router() instance to be used by server.ts
export const QuestionRoute: Router = router;
