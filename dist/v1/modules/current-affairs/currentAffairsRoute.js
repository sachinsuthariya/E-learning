"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentAffairsRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const currentAffairsModel_1 = require("./currentAffairsModel");
const currentAffairsController_1 = require("./currentAffairsController");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const currentAffairsController = new currentAffairsController_1.CurrentAffairsController();
const middleware = new middleware_1.Middleware();
// current affairs routes
router.post("/", v.validate(currentAffairsModel_1.CurrentAffairsModel), currentAffairsController.create); // for internal use only
router.put("/:id", v.validate(currentAffairsModel_1.CurrentAffairsModel), currentAffairsController.update);
router.put("/status/:id", currentAffairsController.updateStatus);
router.delete("/:id", currentAffairsController.delete);
router.patch("/:id", currentAffairsController.restore);
router.get("/:id", currentAffairsController.getById);
router.get("/", currentAffairsController.allCurrentAffairs); // all current affairs
// Export the express.Router() instance to be used by server.ts
exports.CurrentAffairsRoute = router;
//# sourceMappingURL=currentAffairsRoute.js.map