// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { CurrentAffairsModel } from "./currentAffairsModel";
import { CurrentAffairsController } from "./currentAffairsController";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const currentAffairsController = new CurrentAffairsController();

// authentication
router.post("/create", v.validate(CurrentAffairsModel), currentAffairsController.create); // for internal use only

// Export the express.Router() instance to be used by server.ts
export const CurrentAffairsRoute: Router = router;
