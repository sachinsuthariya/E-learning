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

  // Update course video
  public updateByIdCourseVideo = async (videoId: string, videoDetails: Json) =>
  await My.update(Tables.COURSE_VIDEO, videoDetails, "id=?", [videoId]);
  
  // Create Course Materials
  public courseMaterial = (materialDetails: Json) =>
  My.insert(Tables.COURSE_MATERIAL, materialDetails);

  // Update course material
  public updateByIdCourseMaterial = async (materialId: string, materialDetails: Json) =>
    await My.update(Tables.COURSE_MATERIAL, materialDetails, "id=?", [materialId]);

  // Create Video Category
  public videoCategory = (videoCategoryDetails: Json) =>
  My.insert(Tables.VIDEO_CATEGORY, videoCategoryDetails);

  // Update course material category
  public updateVideoCategory = async (categoryId: string, categoryDetails: Json) =>
    await My.update(Tables.VIDEO_CATEGORY, categoryDetails, "id=?", [categoryId]);

  // Create Material Category
  public materialCategory = (materialCategoryDetails: Json) =>
  My.insert(Tables.MATERIAL_CATEGORY, materialCategoryDetails);

  // Update course material category
  public updateMaterialCategory = async (categoryId: string, categoryDetails: Json) =>
  await My.update(Tables.MATERIAL_CATEGORY, categoryDetails, "id=?", [categoryId]);

  /**
   * Get Course by ID
   * @param courseDetails
   * @returns
   */
  public getById = async (courseId: string, loginUserId: string) => {
    const model = `${Tables.COURSE} AS course INNER JOIN ${Tables.CATEGORY} AS category ON course.category_id = category.id`;
    console.log(courseId);
    const course = await My.first(
      model,
      [
        "course.id",
        "course.user_id",
        "course.title",
        "course.description",
        "course.isIncludesLiveClass",
        "course.category_id",
        "category.title as category",
        "course.isFree",
        "course.materials",
        "course.payment_url",
        "course.price",
        "course.material_price",
        "course.attachment",
        "course.status",
        "course.created_at",
        "course.updated_at",
        "course.deleted_at",
      ],
      "course.id=?",
      [courseId]
    );
    if (course) {
      const video_categories = await this.getVideoCategoriesByCourseForApp(courseId);
      const material_categories = await this.getMaterialCategoriesByCourseForApp(courseId);
      if(loginUserId !== null)
      {
        // console.log(loginUserId);
        course.user_id && course.user_id !== null ? (!course.user_id.includes(loginUserId) ? course.isPurchased = false : course.isPurchased = true) : course.isPurchased = false;
      } else {
        course.isPurchased = false;
      }
      // Combine the course and videos data
      course.attachment = Utils.getImagePath(course.attachment);
      course.video_categories = video_categories;
      course.material_categories = material_categories;
    }
    console.log(course);
    delete course.user_id;
    return course;
  };
private getVideoCategoriesByCourse = async (courseId: string) => {
  const categories = await My.findAll(
    Tables.VIDEO_CATEGORY,
    [
      "id",
      "course_id",
      "title"
    ],
    "course_id=?",
    [courseId]
  );
  await Promise.all(
  categories.map(async(category) => {
     category.videos = await this.getVideosByCategoryId(category.id);
    //  console.log(category);
    return category;
  })
  );
  console.log(categories);
  return categories;
  };
  private getVideoCategoriesByCourseForApp = async (courseId: string) => {
    const categories = await My.findAll(
      Tables.VIDEO_CATEGORY,
      [
        "id",
        "course_id",
        "title"
      ],
      "course_id=?",
      [courseId]
    );
     // Filter out categories that don't have any videos
    const categoriesWithVideos = await Promise.all(
      categories.map(async category => {
        const {videos, hasLive} = await this.getVideosByCategoryId(category.id);
        if (videos.length > 0) {
          category.videos = videos;
          category.hasLive = hasLive; 
          return category;
        }
        return null; // Return null for categories without videos
      })
    );

    // Remove null entries (categories without videos)
    const filteredCategories = categoriesWithVideos.filter(category => category !== null);

    return filteredCategories;
    };
  private getVideoById = async (videoId: string) => {
    const video = await My.first(
      Tables.COURSE_VIDEO,
      [
        "id",
        "title",
        "video_category_id",
        "description",
        "isFree",
        "isLive",
        "thumbnail",
        "video",
        "course_id",
        "created_at"
      ],
      "id=?",
      [videoId]
    );

    video.videoThumbnail = Utils.getImagePath(video.thumbnail);

    
      const currentUploadedDate = new Date(
        video.created_at
      )
      const formatedUploadedDate = new Date(
        currentUploadedDate.getFullYear(),
        currentUploadedDate.getMonth(),
        currentUploadedDate.getDate()
      )
      video.created_at = formatedUploadedDate;

    return video;
  };
  private getVideosByCategoryId = async (categoryId: string) => {
    // Implement the logic to fetch videos based on the categoryId
    const videos = await My.findAll(
      Tables.COURSE_VIDEO,
      [
        "id",
        "title",
        "video_category_id",
        "description",
        "isFree",
        "isLive",
        "thumbnail",
        "video",
        "course_id",
        "created_at"
      ],
      "video_category_id=?",
      [categoryId]
    );
    await Promise.all(
    videos.map(async(thumb) => {
      thumb.videoThumbnail = Utils.getImagePath(thumb.thumbnail);
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
    // Check if any video in the category has isLive equal to 1
    const hasLive = videos.some(video => video.isLive === 1);

    // Return an object with both videos array and hasLive property
    return {
        videos,
        hasLive,
    };
  };
  
  /**
   * Get All Video Categories
   * @param categoryDetails
   * @returns
   */
  public allVideoCategories = async () => {
    const getAllCategories = await My.findAll(Tables.VIDEO_CATEGORY, [
      "id",
      "course_id",
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
      if(!videoCategory){
        const categoryData = '';
      
        return categoryData;
      }
      else{
        return videoCategory;
      }
    }
    private getMaterialCategoriesByCourse = async (courseId: string) => {
      const categories = await My.findAll(
        Tables.MATERIAL_CATEGORY,
        [
          "id",
          "course_id",
          "title"
        ],
        "course_id=?",
        [courseId]
      );
      await Promise.all(
        categories.map(async(category) => {
          category.materials = await this.getMaterialsByCategoryId(category.id);
          return category;
        })
      );
      return categories;
    };
    private getMaterialCategoriesByCourseForApp = async (courseId: string) => {
      const categories = await My.findAll(
        Tables.MATERIAL_CATEGORY,
        [
          "id",
          "course_id",
          "title"
        ],
        "course_id=?",
        [courseId]
      );
      // Filter out categories that don't have any materials
    const categoriesWithMaterials = await Promise.all(
      categories.map(async category => {
        const materials = await this.getMaterialsByCategoryId(category.id);
        if (materials.length > 0) {
          category.materials = materials;
          return category;
        }
        return null; // Return null for categories without materials
      })
    );

    // Remove null entries (categories without materials)
    const filteredCategories = categoriesWithMaterials.filter(category => category !== null);

    return filteredCategories;
    };
      private getMaterialsByCategoryId = async (categoryId: string) => {
        // Implement the logic to fetch materials based on the categoryId
        const materials = await My.findAll(
          Tables.COURSE_MATERIAL,
          [
            "id",
            "title",
            "material_category_id",
            "description",
            "isFree",
            "thumbnail",
            "file",
            "course_id",
            "created_at"
          ],
          "material_category_id=?",
          [categoryId]
        );
        await Promise.all(
          materials.map(async(thumb) => {
            thumb.materialThumbnail = Utils.getImagePath(thumb.thumbnail);
            thumb.materialFile = Utils.getDocumentPath(thumb.file);
            // thumb.materialCategory = await this.getByIdMaterialCategory(thumb.material_category_id);
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
      private getMaterialById = async (materialId: string) => {
        // Implement the logic to fetch materials based on the categoryId
        const material = await My.first(
          Tables.COURSE_MATERIAL,
          [
            "id",
            "title",
            "material_category_id",
            "description",
            "isFree",
            "thumbnail",
            "file",
            "course_id",
            "created_at"
          ],
          "id=?",
          [materialId]
        );
            material.materialThumbnail = Utils.getImagePath(material.thumbnail);
            material.materialCategory = await this.getByIdMaterialCategory(material.material_category_id);

          const currentUploadedDate = new Date(
            material.created_at
          )
          const formatedUploadedDate = new Date(
            currentUploadedDate.getFullYear(),
            currentUploadedDate.getMonth(),
            currentUploadedDate.getDate()
          )
          material.created_at = formatedUploadedDate;

        return material;
      };
  /**
   * Get All Material Categories
   * @param categoryDetails
   * @returns
   */
  public allMaterialCategories = async () => {
    const getAllCategories = await My.findAll(Tables.MATERIAL_CATEGORY, [
      "id",
      "course_id",
      "title",
      "created_at",
      "updated_at",
    ]
    );

    return getAllCategories;
  };
  public getByIdMaterialCategory = async (categoryId: string) => {
    const materialCategory = await My.first(
      Tables.MATERIAL_CATEGORY,
      ["id", "title","created_at", "updated_at"],
      "id=?",
      [categoryId]
    );
    if(!materialCategory){
      const categoryData = '';
      return categoryData;
    }
    else{
      return materialCategory;
    }
  }
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
      await Promise.all(
        enquiries.map(async(enquiry) => {
          const course = await this.getById(enquiry.course_id);
          enquiry.courseName = course.title;
          return enquiry;
        })
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
  public destroyVideo = async (videoId: string) => {
    const video = await My.delete(
      Tables.COURSE_VIDEO,
      "id=?",
      [videoId]
    );

    this.deleteVideoImage(videoId);
    return video;
  };
  public destroyMaterial = async (materialId: string) => {
    const material = await My.delete(
      Tables.COURSE_MATERIAL,
      "id=?",
      [materialId]
    );

    this.deleteMaterialImage(materialId);
    this.deleteMaterialFile(materialId);
    return material;
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
  public deleteVideoImage = async (videoId: string) => {
    const video = await My.first(
      Tables.COURSE_VIDEO,
      ["id", "thumbnail"],
      "id = ?",
      [videoId]
    );
    if (video.thumbnail) {
      Media.deleteImage(video.thumbnail);
    }
    return;
  };
  public deleteMaterialImage = async (materialId: string) => {
    const material = await My.first(
      Tables.COURSE_MATERIAL,
      ["id", "thumbnail"],
      "id = ?",
      [materialId]
    );
    if (material.thumbnail) {
      Media.deleteImage(material.thumbnail);
    }
    return;
  };
  public deleteMaterialFile = async (materialId: string) => {
    const material = await My.first(
      Tables.COURSE_MATERIAL,
      ["id", "file"],
      "id = ?",
      [materialId]
    );
    if (material.file) {
      Media.deleteDocument(material.file);
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
  public userEnrolledCourseDelete = async (courseId: string, userId: string) => {
    const course = await My.first(Tables.COURSE, [
      "id",
      "user_id"
    ],
    "id=?",
    [courseId]
    );
     // Parse the user_id JSON array
    const user_idArray = JSON.parse(course.user_id);

    // Remove userId from the user_id array
    const updatedUserIds = user_idArray.filter(id => id !== userId);

    // Convert the updatedUserIds array back to JSON
    const updatedUserIdsJson = JSON.stringify(updatedUserIds);

    const updateResult = await My.update(Tables.COURSE, { user_id: updatedUserIdsJson },"id=?",[courseId]);

    return updateResult;
  }
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
