// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { TestSeriesModel } from "./testSeriesModel";
import { TestSeriesController } from "./testSeriesController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const testSeriesController = new TestSeriesController();
const middleware = new Middleware();

// testSeries routes
router.post("/", middleware.isAuthenticated, v.validate(TestSeriesModel), testSeriesController.create); // for internal use only
router.put("/:id", middleware.isAuthenticated, v.validate(TestSeriesModel), testSeriesController.update);
router.put("/status/:id", middleware.isAuthenticated, testSeriesController.updateStatus);
router.delete("/:id", middleware.isAuthenticated, testSeriesController.delete);
router.patch("/:id", middleware.isAuthenticated, testSeriesController.restore);
router.get('/all-test-series', testSeriesController.appAllTestSeries); // app only route

// testSeries enrollment
router.put("/:id/enroll-test-series", middleware.isAuthenticated, testSeriesController.enrollTestSeriesUser); // enroll student for testSeries
router.get("/enrolled-students/:id", middleware.isAuthenticated, testSeriesController.enrolledStudentsCheckAdmin); // fetch assigned students in testSeries table
router.get("/enrolled", middleware.isAuthenticatedStudent, testSeriesController.enrolledTestSeries); //for app use only for fetch user's testSeriess in my testSeriess table
router.get("/enrolled-test-series/:id", middleware.isAuthenticated, testSeriesController.enrolledTestSeriesCheckAdmin); // fetch user's testSeriess in users table
router.get("/user-test-series-delete/:testSeriesId/:userId", middleware.isAuthenticated, testSeriesController.userTestSeriesDelete); // delete user from testSeries in user's table

//testSeries enquiry
router.get('/enquiries', middleware.isAuthenticated, testSeriesController.allTestSeriesEnquiries);
router.post("/enquiry-store", middleware.isAuthenticatedStudent, testSeriesController.createEnquiry);

//testSeries tests
router.put("/:id/enroll-test", middleware.isAuthenticatedStudent, testSeriesController.enrollTestUser);
router.post("/test-store", middleware.isAuthenticated, testSeriesController.createTest);
router.get('/test/:id', middleware.isAuthenticatedAll, testSeriesController.getTestById);
router.get("/tests/:id", middleware.isAuthenticated, testSeriesController.getTestsByCategoryId); /// get all Tests by categoryId ///
router.put("/test-update/:id", middleware.isAuthenticated, testSeriesController.updateTest);
// router.delete("/video-delete/:id", middleware.isAuthenticated, testSeriesController.deleteVideo);

// test categories
router.post("/exam-category-store", middleware.isAuthenticated, testSeriesController.createExamCategory);
router.put("/exam-category-update/:id", middleware.isAuthenticated, testSeriesController.updateExamCategory);
router.get('/exam-categories', middleware.isAuthenticated, testSeriesController.allExamCategories);
router.get('/exam-category/:id', middleware.isAuthenticatedAll, testSeriesController.examCategoryById);
router.get("/exam-categories/:id", middleware.isAuthenticated, testSeriesController.getExamCategoriesByTestSeriesId);

// get test questions
router.get("/:id/questions", middleware.isAuthenticatedStudent, testSeriesController.getTestQuestions) 
router.post("/:id/:questionId/answer", middleware.isAuthenticatedStudent, testSeriesController.submitAnswer)
router.put("/:id/complete-test", middleware.isAuthenticatedStudent, testSeriesController.testComplete);

router.get("/student/test-series/:id", middleware.isAuthenticatedStudent, testSeriesController.getById);
router.get("/:id", testSeriesController.getById);
router.get("/", testSeriesController.allTestSeries); // all TestSeriess //

// Export the express.Router() instance to be used by server.ts
export const TestSeriesRoute: Router = router;
