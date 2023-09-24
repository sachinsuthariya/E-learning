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
router.get("/", currentAffairsController.allCurrentAffairs); // all current affairs
router.post("/create", v.validate(CurrentAffairsModel), currentAffairsController.create); // for internal use only

router.get("/current-affair/:uuid", (req, res) => {
    const uuid = req.params.uuid; // Access the 'uuid' param from the URL
    currentAffairsController.getById(req, res, uuid); // Pass 'uuid' to the controller
});

router.get("/delete/:uuid", (req, res) => {
    const uuid = req.params.uuid;
    currentAffairsController.delete(req, res, uuid);
});
router.put("/update/:uuid", v.validate(CurrentAffairsModel), currentAffairsController.update);

// Export the express.Router() instance to be used by server.ts
export const CurrentAffairsRoute: Router = router;
