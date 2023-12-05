import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";
import { Media } from "../../../helpers/media";
import { UserUtils } from "../user/userUtils";
import axios from 'axios';

export class CourseUtils {
  public sqlUtils: SqlUtils = new SqlUtils();
  private userUtils: UserUtils = new UserUtils();
  private zoomApiBaseUrl = "https://api.zoom.us/v2";

  // Create Courses
  public create = (courseDetails: Json) =>
    My.insert(Tables.COURSE, courseDetails);

  // Create Course Enquiries
  public createEnquiry = (enqiryDetails: Json) =>
  My.insert(Tables.COURSE_ENQUIRY, enqiryDetails);
  
  // Create Course Videos
  public courseVideo = (videoDetails: Json) =>
  My.insert(Tables.COURSE_VIDEO, videoDetails); 
  
  // Create Course Materials
  public courseMaterial = (materialDetails: Json) =>
  My.insert(Tables.COURSE_MATERIAL, materialDetails);

  // Create Video Category
  public videoCategory = (videoCategoryDetails: Json) =>
  My.insert(Tables.VIDEO_CATEGORY, videoCategoryDetails);

  // Create Material Category
  public materialCategory = (materialCategoryDetails: Json) =>
  My.insert(Tables.MATERIAL_CATEGORY, materialCategoryDetails);

  /**
   * Get Course by ID
   * @param courseDetails
   * @returns
   */
  public getById = async (courseId: string) => {
    const course = await My.first(
      Tables.COURSE,
      [
        "id",
        "title",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "materials",
        "payment_url",
        "price",
        "material_price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "id=?",
      [courseId]
    );
    if (course) {
      const videos = await this.getVideosByCourseId(courseId);
      const materials = await this.getMaterialsByCourseId(courseId);
  
      // Combine the course and videos data
      course.attachment = Utils.getImagePath(course.attachment);
      course.videos = videos;
      course.materials = materials;
      // console.log(course);
    }
    return course;
  };
  private getVideosByCourseId = async (courseId: string) => {
    // Implement the logic to fetch videos based on the courseId
    const videos = await My.findAll(
      Tables.COURSE_VIDEO,
      [
        "id",
        "title",
        "video_category_id",
        "description",
        "thumbnail",
        "video",
        "course_id",
        "created_at"
      ],
      "course_id=?",
      [courseId]
    );
    await Promise.all(
    videos.map(async(thumb) => {
      thumb.thumbnail = Utils.getImagePath(thumb.thumbnail);
      // console.log(thumb);
      thumb.category = await this.getByIdVideoCategory(thumb.video_category_id);
      return thumb;
    })
    );
    videos.map((date) => {
      const currentUploadedDate = new Date(
        date.created_at
      )
      const formatedUploadedDate = new Date(
        currentUploadedDate.getFullYear(),
        currentUploadedDate.getMonth(),
        currentUploadedDate.getDate()
      )
      date.created_at = formatedUploadedDate;
      return date;
    });
    return videos;
  };
  /**
   * Get All Video Categories
   * @param categoryDetails
   * @returns
   */
  public allVideoCategories = async () => {
    const getAllCategories = await My.findAll(Tables.VIDEO_CATEGORY, [
      "id",
      "title",
      "created_at",
      "updated_at",
    ]
    );

    return getAllCategories;
  };
  public getByIdVideoCategory = async (categoryId: string) => {

    const videoCategory = await My.first(
      Tables.VIDEO_CATEGORY,
      ["id", "title","created_at", "updated_at"],
      "id=?",
      [categoryId]
      );
      console.log(categoryId)
      return videoCategory;
    }
  private getMaterialsByCourseId = async (courseId: string) => {

    const materials = await My.findAll(
      Tables.COURSE_MATERIAL,
      [
        "id",
        "title",
        "material_category_id",
        "description",
        "thumbnail",
        "file",
        "course_id",
        "created_at"
      ],
      "course_id=?",
      [courseId]
    );
    await Promise.all(
    materials.map(async(thumb) => {
      thumb.thumbnail = Utils.getImagePath(thumb.thumbnail);
      thumb.category = await this.getByIdMaterialCategory(thumb.material_category_id);
      return thumb;
    })
    );
    materials.map((date) => {
      const currentUploadedDate = new Date(
        date.created_at
      )
      const formatedUploadedDate = new Date(
        currentUploadedDate.getFullYear(),
        currentUploadedDate.getMonth(),
        currentUploadedDate.getDate()
      )
      date.created_at = formatedUploadedDate;
      return date;
    });
  
    return materials;
  };
  /**
   * Get All Material Categories
   * @param categoryDetails
   * @returns
   */
  public allMaterialCategories = async () => {
    const getAllCategories = await My.findAll(Tables.MATERIAL_CATEGORY, [
      "id",
      "title",
      "created_at",
      "updated_at",
    ]
    );

    return getAllCategories;
  };
  public getByIdMaterialCategory = async (categoryId: string) =>
    await My.first(
      Tables.MATERIAL_CATEGORY,
      ["id", "title","created_at", "updated_at"],
      "id=?",
      [categoryId]
    );
  /**
   * Get Course by ID for students
   * @param courseDetails
   * @returns
   */
  public getByIdStudent = async (courseId: string) => {
    const course = await My.first(
      Tables.COURSE,
      [
        "id",
        "title",
        "user_id",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "materials",
        "payment_url",
        "price",
        "material_price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "id=?",
      [courseId]
    );
    course.attachment = Utils.getImagePath(course.attachment);
    return course;
  };

  /**
   * Get All Courses
   * @param courseDetails
   * @returns
   */
  public getAllCourses = async () => {
    const courses = await My.findAll(
      Tables.COURSE,
      [
        "id",
        "title",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "materials",
        "price",
        "payment_url",
        "material_price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status!=?",
      ["deleted"]
    );

    courses.map((course) => {
      course.attachment = Utils.getImagePath(course.attachment);
      return course;
    });

    return courses;
  };

    /**
   * Get All Course Enquiries
   * @param courseDetails
   * @returns
   */
    public getAllEnquiries = async () => {
      const enquiries = await My.findAll(
        Tables.COURSE_ENQUIRY,
        [
          "id",
          "course_id",
          "user_id",
          "purchase_date",
          "name",
          "email",
          "dob",
          "category",
          "address",
          "qualification",
          "whatsapp_number",
          "telegram_id",
          "emergency_number",
          "mobile_model",
          "exam_appear",
          "competitive_exam",
          "materials",
          "price",
          "status",
          "created_at",
          "updated_at",
        ],
        "status=?",
        ["active"]
      );
        // console.log(enquiries);
      return enquiries;
    };
  /**
   * Get All Courses
   * @param courseDetails
   * @returns
   */
  public getAllActiveCourses = async () => {
    const courses = await My.findAll(
      Tables.COURSE,
      [
        "id",
        "title",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "materials",
        "price",
        "payment_url",
        "material_price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status=?",
      ["active"]
    );

    courses.map((course) => {
      course.attachment = Utils.getImagePath(course.attachment);
      return course;
    });

    return courses;
  };

  /**
   * Course Status changed to Deleted by ID
   * @param courseDetails
   * @returns
   */
  public destroy = async (courseId: string) => {
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const course = await My.update(
      Tables.COURSE,
      { status: "deleted", deleted_at: currentTimestamp },
      "id=?",
      [courseId]
    );

    this.deleteImage(courseId);
    return course;
  };

  /**
   * Course Status changed to Draft and remove data of deleted_at column by ID
   * @param courseDetails
   * @returns
   */
  public restoreCourse = async (courseId: string) =>
    await My.update(
      Tables.COURSE,
      { status: "active", deleted_at: null },
      "id=?",
      [courseId]
    );

  /**
   * Course Update Fields by ID
   * @param courseId string
   * @param courseDetails Json
   * @returns
   */
  public updateById = async (courseId: string, courseDetails: Json) =>
    await My.update(Tables.COURSE, courseDetails, "id=?", [courseId]);

  public deleteImage = async (courseId: string) => {
    const course = await My.first(
      Tables.COURSE,
      ["id", "attachment"],
      "id = ?",
      [courseId]
    );
    if (course.attachment) {
      Media.deleteImage(course.attachment);
    }
    return;
  };
  public studentEnrollment = async (courseId: string, studentId: string) => {
    const course = await this.getByIdStudent(courseId);
    // console.log(course);
    
    if (!course || !course.user_id) {
      const updatedCourse = await My.update(
        Tables.COURSE,
        { user_id: JSON.stringify([studentId]) },
        "id=?",
        [courseId]
      );
    } else {
      // Parse the existing user_ids as an array
      const existingUserIds = JSON.parse(course.user_id);
      // console.log(existingUserIds);
      // Check if the current user's ID is not already in the array
      if (!existingUserIds.includes(studentId)) {
        existingUserIds.push(studentId);

        // Update the user_id column with the modified array
        const updatedCourse = await My.update(
          Tables.COURSE,
          { user_id: JSON.stringify(existingUserIds) },
          "id=?",
          [courseId]
        );
      }
    }
    return course;
  };
  public courseEnrolledStudents = async (courseId: string) => {
    const course = await this.getByIdStudent(courseId);
     // Assuming getByIdStudent returns an array of user IDs
    const userIds = course.user_id;
    const students = await this.userUtils.getAllStudents();

    const filteredStudents = students.filter(student => userIds.includes(student.id));
      
    return [filteredStudents,{"course":course.title}];
  };
  public userEnrolledCourses = async (loginUserId: string) => {
    const getAllCourses = await My.findAll(Tables.COURSE, [
      "id",
      "title",
      "user_id",
      "description",
      "isIncludesLiveClass",
      "category_id",
      "isFree",
      "materials",
      "price",
      "payment_url",
      "material_price",
      "attachment",
      "status",
      "created_at",
      "updated_at",
      "deleted_at",
    ]);

    // return getAllCourses;
    const userCourses = [];

    getAllCourses.forEach((course) => {
      // console.log(course);
      try {
        const userIdArray = JSON.parse(course.user_id);
        if (Array.isArray(userIdArray)) {
          if (userIdArray.includes(loginUserId)) {
            userCourses.push(course);
          }
        } else {
          console.log(`Invalid user_id format for course ${course.id}`);
        }
      } catch (error) {
        // Handle JSON parsing error, e.g., if the "user_id" is not a valid JSON array
        console.error(`Error parsing user_id for course ${course.id}:`, error);
      }
    });

    userCourses.map((course) => {
      course.attachment = Utils.getImagePath(course.attachment);
      return course;
    });
    return userCourses;
  };
  public createZoomMeeting = async (accessToken: string, courseId: string): Promise<any> => {
    const createMeetingEndpoint = `${this.zoomApiBaseUrl}/users/me/meetings`;
    
    try {
      const response = await axios.post(
        createMeetingEndpoint,
        {
          topic: `Live Stream for Course ${courseId}`,
          type: 1, // Scheduled meeting
          start_time: new Date().toISOString(),
          duration: 60, // Meeting duration in minutes
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Zoom API Error Data:", error.response.data);
        console.error("Zoom API Error Status:", error.response.status);
        console.error("Zoom API Error Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Zoom API No Response:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Zoom API Error Message:", error.message);
      }
      throw error;
    }
  };

}
