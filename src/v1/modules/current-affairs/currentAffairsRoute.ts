// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { CurrentAffairsModel } from "./currentAffairsModel";
import { CurrentAffairsController } from "./currentAffairsController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const currentAffairsController = new CurrentAffairsController();
const middleware = new Middleware();

// current affairs routes
router.post("/", middleware.isAuthenticated, v.validate(CurrentAffairsModel), currentAffairsController.create); // for internal use only
router.put("/:id", middleware.isAuthenticated, v.validate(CurrentAffairsModel), currentAffairsController.update);
router.put("/status/:id", middleware.isAuthenticated, currentAffairsController.updateStatus);
router.delete("/:id", middleware.isAuthenticated, currentAffairsController.delete);
router.patch("/:id", middleware.isAuthenticated, currentAffairsController.restore);
router.get("/:id", currentAffairsController.getById);
router.get("/", currentAffairsController.allCurrentAffairs); // all current affairs
router.get("/lang/:lang", currentAffairsController.allCurrentAffairsByLanguage); // all current affairs by language
router.post("/upload-files", middleware.isAuthenticatedUser, currentAffairsController.uploadFiles)

// Export the express.Router() instance to be used by server.ts
export const CurrentAffairsRoute: Router = router;
