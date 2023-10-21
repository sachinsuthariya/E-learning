// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { BookModel } from "./bookModel";
import { BookController } from "./bookController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const bookController = new BookController();
const middleware = new Middleware();

// book routes
router.post("/", v.validate(BookModel), bookController.create); // for internal use only
router.put("/:id", v.validate(BookModel), bookController.update);
router.put("/status/:id", bookController.updateStatus);
router.delete("/:id", bookController.delete);
router.patch("/:id", bookController.restore);
router.get("/:id", bookController.getById);
router.get("/", bookController.allBooks); // all Books

// Export the express.Router() instance to be used by server.ts
export const BookRoute: Router = router;
