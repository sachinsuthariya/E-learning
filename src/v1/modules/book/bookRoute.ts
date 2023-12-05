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
router.post("/", middleware.isAuthenticated, v.validate(BookModel), bookController.create); // for internal use only
router.put("/:id", middleware.isAuthenticated, v.validate(BookModel), bookController.update);
router.put("/status/:id", middleware.isAuthenticated, bookController.updateStatus);
router.delete("/:id", middleware.isAuthenticated, bookController.delete);
router.patch("/:id", middleware.isAuthenticated, bookController.restore);

// book enrollment
router.put("/:id/enroll-book", middleware.isAuthenticated, bookController.enrollBookUser);
router.get("/enrolled-students/:id", middleware.isAuthenticated, bookController.enrolledStudentsCheckAdmin);
router.get("/enrolled", middleware.isAuthenticatedStudent, bookController.enrolledBooks);
router.get("/enrolled-books/:id", middleware.isAuthenticated, bookController.enrolledBooksCheckAdmin);

//Book enquiry
router.get('/enquiries', middleware.isAuthenticated, bookController.allBookEnquiries);
router.post("/enquiry-store", middleware.isAuthenticatedStudent, bookController.createEnquiry);

router.get("/:id", bookController.getById);
router.get("/", bookController.allBooks); // all Books

// Export the express.Router() instance to be used by server.ts
export const BookRoute: Router = router;
