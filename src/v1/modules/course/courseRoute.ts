// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { CourseModel } from "./courseModel";
import { CourseController } from "./courseController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const courseController = new CourseController();
const middleware = new Middleware();

// course routes
router.post("/", middleware.isAuthenticated, v.validate(CourseModel), courseController.create); // for internal use only
router.put("/:id", middleware.isAuthenticated, v.validate(CourseModel), courseController.update);
router.put("/status/:id", middleware.isAuthenticated, courseController.updateStatus);
router.delete("/:id", middleware.isAuthenticated, courseController.delete);
router.patch("/:id", middleware.isAuthenticated, courseController.restore);
// router.get('/youtube-live/auth/:id', courseController.createMeeting);
router.post('/zoom-live/auth', courseController.createMeeting);
router.post('/zoom-generate-signature', courseController.createSignature);
// router.get('/startLiveStream', courseController.startLiveStream);
router.get('/allCourses', courseController.appAllCourses); // app only route

// course enrollment
router.put("/:id/enroll-course", middleware.isAuthenticated, courseController.enrollCourseUser); // enroll student for course
router.get("/enrolled-students/:id", middleware.isAuthenticated, courseController.enrolledStudentsCheckAdmin); // fetch assigned users in course table
router.get("/enrolled", middleware.isAuthenticatedStudent, courseController.enrolledCourses); //for app use only for fetch user's courses in my courses tab
router.get("/enrolled-courses/:id", middleware.isAuthenticated, courseController.enrolledCoursesCheckAdmin); // fetch user's courses in users table
router.get("/user-course-delete/:courseId/:userId", middleware.isAuthenticated, courseController.userCourseDelete); // delete user from course in user's table

//course enquiry
router.get('/enquiries', middleware.isAuthenticated, courseController.allCourseEnquiries);
router.post("/enquiry-store", middleware.isAuthenticatedStudent, courseController.createEnquiry);

//course Video
router.post("/video-store", middleware.isAuthenticated, courseController.createVideo);
router.get('/video/:id', middleware.isAuthenticatedAll, courseController.getVideoById);
router.get("/videos/:id", middleware.isAuthenticated, courseController.getVideosByCategoryId); /// get all videos by categoryId
router.put("/video-update/:id", middleware.isAuthenticated, courseController.updateVideo);
router.put("/video-live-status-update/:id", middleware.isAuthenticated, courseController.updateVideoLiveStatus);
router.delete("/video-delete/:id", middleware.isAuthenticated, courseController.deleteVideo);

//video chats
router.post("/chat-store", middleware.isAuthenticated, courseController.storeChat);
router.get("/chats", middleware.isAuthenticated, courseController.videoChats);

router.get("/video-categories/:id", middleware.isAuthenticated, courseController.getVideoCategoriesByCourseId);
router.put("/video-category-update/:id", middleware.isAuthenticated, courseController.updateVideoCategory);
router.post("/video-category-store", middleware.isAuthenticated, courseController.createVideoCategory);
router.get('/video-categories', middleware.isAuthenticated, courseController.allVideoCategories);
router.get('/video-category/:id', middleware.isAuthenticatedAll, courseController.videoCategoryById);


//course materials
router.post("/material-store", middleware.isAuthenticated, courseController.createMaterials);
router.get('/material/:id', middleware.isAuthenticatedAll, courseController.getMaterialById);
router.get("/materials/:id", middleware.isAuthenticated, courseController.getMaterialsByCategoryId); /// get all videos by categoryId
router.put("/material-update/:id", middleware.isAuthenticated, courseController.updateMaterial);
router.delete("/material-delete/:id", middleware.isAuthenticated, courseController.deleteMaterial);

router.get("/material-categories/:id", middleware.isAuthenticated, courseController.getMaterialCategoriesByCourseId);
router.put("/material-category-update/:id", middleware.isAuthenticated, courseController.updateMaterialCategory);
router.post("/material-category-store", middleware.isAuthenticated, courseController.createMaterialCategory);
router.get('/material-categories', middleware.isAuthenticated, courseController.allMaterialCategories);
router.get('/material-category/:id', middleware.isAuthenticatedAll, courseController.materialCategoryById);


router.get("/student/course/:id", middleware.isAuthenticatedStudent, courseController.getById);
router.get("/:id", courseController.getById);
router.get("/", courseController.allCourses); // all Courses

// Export the express.Router() instance to be used by server.ts
export const CourseRoute: Router = router;
