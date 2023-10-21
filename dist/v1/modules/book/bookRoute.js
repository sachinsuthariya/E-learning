"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const bookModel_1 = require("./bookModel");
const bookController_1 = require("./bookController");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const bookController = new bookController_1.BookController();
const middleware = new middleware_1.Middleware();
// book routes
router.post("/", v.validate(bookModel_1.BookModel), bookController.create); // for internal use only
router.put("/:id", v.validate(bookModel_1.BookModel), bookController.update);
router.put("/status/:id", bookController.updateStatus);
router.delete("/:id", bookController.delete);
router.patch("/:id", bookController.restore);
router.get("/:id", bookController.getById);
router.get("/", bookController.allBooks); // all Books
// Export the express.Router() instance to be used by server.ts
exports.BookRoute = router;
//# sourceMappingURL=bookRoute.js.map