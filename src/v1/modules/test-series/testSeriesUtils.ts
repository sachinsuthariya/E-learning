import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";
import { Media } from "../../../helpers/media";
import { UserUtils } from "../user/userUtils";
import axios from 'axios';

export class TestSeriesUtils {
  public sqlUtils: SqlUtils = new SqlUtils();
  private userUtils: UserUtils = new UserUtils();
  private zoomApiBaseUrl = "https://api.zoom.us/v2";

  // Create TestSeries
  public create = (testSeriesDetails: Json) =>
    My.insert(Tables.TEST_SERIES, testSeriesDetails);

  // Create TestSeries Enquiries
  public createEnquiry = (enqiryDetails: Json) =>
  My.insert(Tables.TEST_SERIES_ENQUIRY, enqiryDetails);
  
  // Create TestSeries Exam
  public testSeriesTest = (testDetails: Json) =>
  My.insert(Tables.EXAM, testDetails); 

  // Update testSeries video
  public updateByIdTestSeriesTest = async (testId: string, testDetails: any) =>
  await My.update(Tables.EXAM, testDetails, "id=?", [testId]);
  
  // Create TestSeries Materials
  public testSeriesMaterial = (materialDetails: Json) =>
  My.insert(Tables.COURSE_MATERIAL, materialDetails);

  // Update testSeries material
  public updateByIdTestSeriesMaterial = async (materialId: string, materialDetails: Json) =>
    await My.update(Tables.COURSE_MATERIAL, materialDetails, "id=?", [materialId]);

  // Create Video Category
  public examCategory = (examCategoryDetails: Json) =>
  My.insert(Tables.EXAM_CATEGORY, examCategoryDetails);

  // Update testSeries material category
  public updateExamCategory = async (categoryId: string, categoryDetails: Json) =>
    await My.update(Tables.EXAM_CATEGORY, categoryDetails, "id=?", [categoryId]);

  // Create Material Category
  public materialCategory = (materialCategoryDetails: Json) =>
  My.insert(Tables.MATERIAL_CATEGORY, materialCategoryDetails);

  // Update testSeries material category
  public updateMaterialCategory = async (categoryId: string, categoryDetails: Json) =>
  await My.update(Tables.MATERIAL_CATEGORY, categoryDetails, "id=?", [categoryId]);

  /**
   * Get TestSeries by ID
   * @param testSeriesDetails
   * @returns
   */
  public getById = async (testSeriesId: string, loginUserId: string) => {
    console.log(testSeriesId);
    const testSeries = await My.first(
      Tables.TEST_SERIES,
      [
        "id",
        "user_id",
        "title",
        "description",
        "isFree",
        "payment_url",
        "price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "id=?",
      [testSeriesId]
    );
    console.log(testSeries);
    if (testSeries) {
      const test_categories = await this.getExamCategoriesByTestSeriesForApp(testSeriesId);
      if(loginUserId !== null)
      {
        // console.log(loginUserId);
        testSeries.user_id && testSeries.user_id !== null ? (!testSeries.user_id.includes(loginUserId) ? testSeries.isPurchased = false : testSeries.isPurchased = true) : testSeries.isPurchased = false;
      } else {
        testSeries.isPurchased = false;
      }
      // Combine the testSeries and videos data
      testSeries.attachment = Utils.getImagePath(testSeries.attachment);
      testSeries.test_categories = test_categories;
      // testSeries.material_categories = material_categories;
    }
    console.log(testSeries);
    delete testSeries.user_id;
    return testSeries;
  };
private getExamCategoriesByTestSeries = async (testSeriesId: string) => {
  const categories = await My.findAll(
    Tables.EXAM_CATEGORY,
    [
      "id",
      "test_series_id",
      "title"
    ],
    "test_series_id=?",
    [testSeriesId]
  );
  await Promise.all(
  categories.map(async(category) => {
     category.tests = await this.getTestsByCategoryId(category.id);
    //  console.log(category);
    return category;
  })
  );
  console.log(categories);
  return categories;
  };
  private getExamCategoriesByTestSeriesForApp = async (testSeriesId: string) => {
    const categories = await My.findAll(
      Tables.EXAM_CATEGORY,
      [
        "id",
        "test_series_id",
        "title"
      ],
      "test_series_id=?",
      [testSeriesId]
    );
     // Filter out categories that don't have any videos
    const categoriesWithTests = await Promise.all(
      categories.map(async category => {
        const tests = await this.getTestsByCategoryId(category.id);
        if (tests.length > 0) {
          category.tests = tests;
          return category;
        }
        return null; // Return null for categories without videos
      })
    );

    // Remove null entries (categories without videos)
    const filteredCategories = categoriesWithTests.filter(category => category !== null);

    return filteredCategories;
    };
  private getTestById = async (examId: string) => {
    const exam = await My.first(
      Tables.EXAM,
      [
        "id",
        "test_series_id",
        "exam_category_id",
        "title",
        "description",
        "exam_date",
        "duration_minutes",
        "start_time",
        "end_time",
        "attachment",
        "total_marks",
        "isFree",
        "resultShow",
        "status",
        "user_id",
        "created_at",
        "updated_at",
      ],
      "id=?",
      [examId]
    );

    exam.examThumbnail = Utils.getImagePath(exam.attachment);

    
      const currentUploadedDate = new Date(
        exam.created_at
      )
      const formatedUploadedDate = new Date(
        currentUploadedDate.getFullYear(),
        currentUploadedDate.getMonth(),
        currentUploadedDate.getDate()
      )
      exam.created_at = formatedUploadedDate;

    return exam;
  };
  private getTestsByCategoryId = async (categoryId: string) => {
    // Implement the logic to fetch tests based on the categoryId
    const tests = await My.findAll(
      Tables.EXAM,
      [
        "id",
        "test_series_id",
        "exam_category_id",
        "description",
        "title",
        "duration_minutes",
        "start_time",
        "end_time",
        "attachment",
        "user_id",
        "isFree",
        "resultShow",
        "status",
        "total_marks",
        "created_at",
        "updated_at",
        "exam_date",
      ],
      "exam_category_id=? AND status!=?",
      [categoryId,"inactive"]
    );
    await Promise.all(
    tests.map(async(thumb) => {
      thumb.testThumbnail = Utils.getImagePath(thumb.attachment);
      return thumb;
    })
    );
    tests.map((date) => {
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

    // Return an object with both videos array and hasLive property
    return tests;
  };
  
  /**
   * Get All Video Categories
   * @param categoryDetails
   * @returns
   */
  public allExamCategories = async () => {
    const getAllCategories = await My.findAll(Tables.EXAM_CATEGORY, [
      "id",
      "test_series_id",
      "title",
      "created_at",
      "updated_at",
    ]
    );

    return getAllCategories;
  };
  public getByIdExamCategory = async (categoryId: string) => {

    const examCategory = await My.first(
      Tables.EXAM_CATEGORY,
      ["id", "title","created_at", "updated_at"],
      "id=?",
      [categoryId]
      );
      console.log(categoryId)
      if(!examCategory){
        const categoryData = '';
      
        return categoryData;
      }
      else{
        return examCategory;
      }
    }
    
  /**
   * Get TestSeries by ID for students
   * @param testSeriesDetails
   * @returns
   */
  public getByIdStudent = async (testSeriesId: string) => {
    const testSeries = await My.first(
      Tables.TEST_SERIES,
      [
        "id",
        "title",
        "user_id",
        "description",
        "isFree",
        "payment_url",
        "price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "id=?",
      [testSeriesId]
    );
    testSeries.attachment = Utils.getImagePath(testSeries.attachment);
    return testSeries;
  };

  /**
   * Get All TestSeries
   * @param testSeriesDetails
   * @returns
   */
  public getAllTestSeries = async () => {
    const testSeries = await My.findAll(
      Tables.TEST_SERIES,
      [
        "id",
        "title",
        "description",
        "isFree",
        "price",
        "payment_url",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status!=?",
      ["deleted"]
    );

    testSeries.map((testSeries) => {
      testSeries.attachment = Utils.getImagePath(testSeries.attachment);
      return testSeries;
    });

    return testSeries;
  };

    /**
   * Get All TestSeries Enquiries
   * @param testSeriesDetails
   * @returns
   */
    public getAllEnquiries = async () => {
      const enquiries = await My.findAll(
        Tables.TEST_SERIES_ENQUIRY,
        [
          "id",
          "test_series_id",
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
          const testSeries = await this.getById(enquiry.test_series_id);
          enquiry.testSeriesName = testSeries.title;
          return enquiry;
        })
      );
        // console.log(enquiries);
      return enquiries;
    };
  /**
   * Get All TestSeries
   * @param testSeriesDetails
   * @returns
   */
  public getAllActiveTestSeries = async () => {
    const testSeries = await My.findAll(
      Tables.TEST_SERIES,
      [
        "id",
        "title",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "price",
        "payment_url",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status=?",
      ["active"]
    );

    testSeries.map((testSeries) => {
      testSeries.attachment = Utils.getImagePath(testSeries.attachment);
      return testSeries;
    });

    return testSeries;
  };

  /**
   * TestSeries Status changed to Deleted by ID
   * @param testSeriesDetails
   * @returns
   */
  public destroy = async (testSeriesId: string) => {
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const testSeries = await My.update(
      Tables.TEST_SERIES,
      { status: "deleted", deleted_at: currentTimestamp },
      "id=?",
      [testSeriesId]
    );

    this.deleteImage(testSeriesId);
    return testSeries;
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

  /**
   * TestSeries Status changed to Draft and remove data of deleted_at column by ID
   * @param testSeriesDetails
   * @returns
   */
  public restoreTestSeries = async (testSeriesId: string) =>
    await My.update(
      Tables.TEST_SERIES,
      { status: "active", deleted_at: null },
      "id=?",
      [testSeriesId]
    );

  /**
   * TestSeries Update Fields by ID
   * @param testSeriesId string
   * @param testSeriesDetails Json
   * @returns
   */
  public updateById = async (testSeriesId: string, testSeriesDetails: Json) =>
    await My.update(Tables.TEST_SERIES, testSeriesDetails, "id=?", [testSeriesId]);

  public deleteImage = async (testSeriesId: string) => {
    const testSeries = await My.first(
      Tables.TEST_SERIES,
      ["id", "attachment"],
      "id = ?",
      [testSeriesId]
    );
    if (testSeries.attachment) {
      Media.deleteImage(testSeries.attachment);
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
  }
  public studentEnrollment = async (testSeriesId: string, studentId: string) => {
    const testSeries = await this.getByIdStudent(testSeriesId);
    // console.log(testSeries);
    
    if (!testSeries || !testSeries.user_id) {
      const updatedTestSeries = await My.update(
        Tables.TEST_SERIES,
        { user_id: JSON.stringify([studentId]) },
        "id=?",
        [testSeriesId]
      );
    } else {
      // Parse the existing user_ids as an array
      const existingUserIds = JSON.parse(testSeries.user_id);

      // Check if the current user's ID is not already in the array
      if (!existingUserIds.includes(studentId)) {
        existingUserIds.push(studentId);

        // Update the user_id column with the modified array
        const updatedTestSeries = await My.update(
          Tables.TEST_SERIES,
          { user_id: JSON.stringify(existingUserIds) },
          "id=?",
          [testSeriesId]
        );
      }
    }
    return testSeries;
  };
  public testSeriesEnrolledStudents = async (testSeriesId: string) => {
    const testSeries = await this.getByIdStudent(testSeriesId);
     // Assuming getByIdStudent returns an array of user IDs
    const userIds = testSeries.user_id;
    const students = await this.userUtils.getAllStudents();

    const filteredStudents = students.filter(student => userIds.includes(student.id));
      
    return [filteredStudents,{"testSeries":testSeries.title}];
  };
  public userEnrolledTestSeries = async (loginUserId: string) => {
    const getAllTestSeries = await My.findAll(Tables.TEST_SERIES, [
      "id",
      "title",
      "user_id",
      "description",
      "isFree",
      "price",
      "payment_url",
      "attachment",
      "status",
      "created_at",
      "updated_at",
      "deleted_at",
    ]);

    // return getAllTestSeries;
    const userTestSeries = [];

    getAllTestSeries.forEach((testSeries) => {
      // console.log(testSeries);
      try {
        const userIdArray = JSON.parse(testSeries.user_id);
        if (Array.isArray(userIdArray)) {
          if (userIdArray.includes(loginUserId)) {
            userTestSeries.push(testSeries);
          }
        } else {
          console.log(`Invalid user_id format for testSeries ${testSeries.id}`);
        }
      } catch (error) {
        // Handle JSON parsing error, e.g., if the "user_id" is not a valid JSON array
        console.error(`Error parsing user_id for testSeries ${testSeries.id}:`, error);
      }
    });

    userTestSeries.map((testSeries) => {
      testSeries.attachment = Utils.getImagePath(testSeries.attachment);
      return testSeries;
    });
    return userTestSeries;
  };
  public userEnrolledTestSeriesDelete = async (testSeriesId: string, userId: string) => {
    const testSeries = await My.first(Tables.TEST_SERIES, [
      "id",
      "user_id"
    ],
    "id=?",
    [testSeriesId]
    );
     // Parse the user_id JSON array
    const user_idArray = JSON.parse(testSeries.user_id);

    // Remove userId from the user_id array
    const updatedUserIds = user_idArray.filter(id => id !== userId);

    // Convert the updatedUserIds array back to JSON
    const updatedUserIdsJson = JSON.stringify(updatedUserIds);

    const updateResult = await My.update(Tables.TEST_SERIES, { user_id: updatedUserIdsJson },"id=?",[testSeriesId]);

    return updateResult;
  }
  public getTestQuestions = async (examId: string, userId: string) => {
    const model = `${Tables.QUESTION} AS q
      INNER JOIN ${Tables.EXAM} AS e ON e.id = q.examId
      INNER JOIN ${Tables.MCQ_OPTION} AS mcq ON q.id = mcq.questionId
      LEFT JOIN ${Tables.STUDENT_EXAM_SUBMISSION} AS sub ON sub.questionId = q.id AND sub.userId = '${userId}'`;

    const condition = `q.examId = '${examId}' AND q.status != 'deleted'`;
    const fields = `q.id as id, q.question, q.questionType, q.points, q.nagativePoints, q.examId, TIME(e.start_time) AS startTime, TIME(e.end_time) AS endTime, e.duration_minutes AS duration, sub.mcqId as selectedMCQ,
      GROUP_CONCAT(
        JSON_OBJECT(
            'id', mcq.id,
            'optionText', mcq.optionText
        )
        ORDER BY mcq.id
    ) AS mcqOptions`;
    const group = `q.id, q.question, q.questionType, q.points, q.nagativePoints, sub.id`;

    const query = `SELECT ${fields} FROM ${model} WHERE ${condition} GROUP BY ${group}`;
    return await My.query(query);
  };
  public userEnrollment = async (examId: string, userId: string) => {
    const exam = await this.getTestById(examId);
    // console.log(exam.user_id);
    
    if (!exam || !exam.user_id) {
      // If user_id is not defined or is not an array, initialize it as an array with the current user's ID
      const updatedExam = await My.update(
        Tables.EXAM,
        { user_id: JSON.stringify([userId]) },
        "id=?",
        [examId]
      );
    } else {
      // Parse the existing user_ids as an array
      const existingUserIds = JSON.parse(exam.user_id);
      // console.log(existingUserIds,userId);
      // Check if the current user's ID is not already in the array
      if (!existingUserIds.includes(userId)) {
        existingUserIds.push(userId);
        // console.log("");
        // Update the user_id column with the modified array
        const updatedExam = await My.update(
          Tables.EXAM,
          { user_id: JSON.stringify(existingUserIds) },
          "id=?",
          [examId]
        );
        console.log(updatedExam);

      }
      const result = await My.update(
        Tables.EXAM_RESULT,
        { temp_score: null },
        "examId=? AND userId=?",
        [examId, userId]
      );
    }
    return exam;
  };
  public submitAnswer = async (
    examId: string,
    questionId: string,
    userId: string,
    mcqId: string
  ) => {
    const where = `examId = ? AND questionId = ? AND userId = ?`;
    const whereParams = [examId, questionId, userId];
    const submission = await My.first(
      Tables.STUDENT_EXAM_SUBMISSION,
      ["id", "examId", "questionId", "mcqId", "userId"],
      where,
      whereParams
    );
    const resultExistCheck = await My.first(
      Tables.EXAM_RESULT,
      ["id", "examId", "userId", "score", "temp_score", "completedAt"],
      "examId=? AND userId=? AND completedAt!=?",
      [examId,userId,"NULL"]
    );

    let submittedAnswer;

    if(resultExistCheck && resultExistCheck.id && submission && submission.id){
      let result = await this.updateTestTempResult(
        examId,
        userId,
        questionId,
        mcqId,
        submission
      );
      return result;

    } else if (submission && submission.id) {
      // Handle update logic for existing submission
      const payload = {
        mcqId,
      };
      submittedAnswer = await My.updateFirst(
        Tables.STUDENT_EXAM_SUBMISSION,
        payload,
        where,
        whereParams
      );
      await this.updateExamResultOnUpdateSubmission(
        examId,
        userId,
        questionId,
        mcqId,
        submission
      );
    } else {
      // Handle insert logic for new submission
      const payload = {
        id: Utils.generateUUID(),
        mcqId,
        questionId,
        examId,
        userId,
      };
      submittedAnswer = await My.insert(
        Tables.STUDENT_EXAM_SUBMISSION,
        payload
      );
      await this.updateExamResultOnNewSubmission(
        examId,
        userId,
        questionId,
        mcqId
      );
    }

    // After submitting the answer, check if the MCQ is correct and adjust the score

    return submittedAnswer;
  };

  private async updateExamResultOnNewSubmission(
    examId: string,
    userId: string,
    questionId: string,
    mcqId: string
  ) {
    const where = `examId = ? AND userId = ?`;
    const whereParams = [examId, userId];

    // Retrieve points for the question and check if it's correct
    const question = await My.first(Tables.QUESTION, ["points"], `id = ?`, [
      questionId,
    ]);
    const mcqOption = await My.first(
      Tables.MCQ_OPTION,
      ["isCorrect"],
      `id = ?`,
      [mcqId]
    );

    if (!question || !question.points) {
      return null;
    }
    const points = question.points;

    // Check if an entry exists in EXAM_RESULTS
    const existingResult = await My.first(
      Tables.EXAM_RESULT,
      ["score"],
      where,
      whereParams
    );

    if (existingResult) {
      // Check if the same combination of mcqId and userId already exists in STUDENT_EXAM_SUBMISSION
      const submissionWhere = `examId = ? AND questionId = ? AND userId = ? AND mcqId = ?`;
      const submissionWhereParams = [examId, questionId, userId, mcqId];
      const existingSubmission = await My.first(
        Tables.STUDENT_EXAM_SUBMISSION,
        ["id"],
        submissionWhere,
        submissionWhereParams
      );

      if (
        !mcqOption ||
        mcqOption.isCorrect !== 0 ||
        !existingSubmission ||
        !existingSubmission.id
      ) {
        await My.updateFirst(
          Tables.EXAM_RESULT,
          { score: existingResult.score + points },
          where,
          whereParams
        );
      }
    } else {
      if (!mcqOption || mcqOption.isCorrect !== 1) {
        await My.insert(Tables.EXAM_RESULT, {
          id: Utils.generateUUID(),
          examId,
          userId,
          score: 0.0,
        });
        return "wrong";
      } else {
        await My.insert(Tables.EXAM_RESULT, {
          id: Utils.generateUUID(),
          examId,
          userId,
          score: points,
        });
        return "new with points";
      }
    }
  }
  private async updateExamResultOnUpdateSubmission(
    examId: string,
    userId: string,
    questionId: string,
    mcqId: string,
    submission
  ) {
    const where = `examId = ? AND userId = ?`;
    const whereParams = [examId, userId];

    // Retrieve points for the question and check if it's correct
    const question = await My.first(Tables.QUESTION, ["points"], `id = ?`, [
      questionId,
    ]);
    const mcqOption = await My.first(
      Tables.MCQ_OPTION,
      ["isCorrect"],
      `id = ?`,
      [mcqId]
    );
    const submittedMcqOption = await My.first(
      Tables.MCQ_OPTION,
      ["isCorrect"],
      `id = ?`,
      [submission.mcqId]
    );

    if (!question || !question.points) {
      return null;
    }
    const points = question.points;

    // Check if an entry exists in EXAM_RESULTS
    const existingResult = await My.first(
      Tables.EXAM_RESULT,
      ["score"],
      where,
      whereParams
    );

    if (existingResult) {
      // Check if the same combination of mcqId and userId already exists in STUDENT_EXAM_SUBMISSION
      const submissionWhere = `examId = ? AND questionId = ? AND userId = ? AND mcqId = ?`;
      const submissionWhereParams = [examId, questionId, userId, mcqId];
      const existingSubmission = await My.first(
        Tables.STUDENT_EXAM_SUBMISSION,
        ["id"],
        submissionWhere,
        submissionWhereParams
      );

      if (existingSubmission || existingSubmission.id) {
        if (
          !mcqOption ||
          (mcqOption.isCorrect !== 0 && submission.mcqId !== mcqId)
        ) {
          if (!submittedMcqOption || submittedMcqOption.isCorrect !== 1) {
            await My.updateFirst(
              Tables.EXAM_RESULT,
              { score: existingResult.score + points },
              where,
              whereParams
            );
          }
        } else if (
          !mcqOption ||
          (mcqOption.isCorrect !== 1 && submission.mcqId !== mcqId)
        ) {
          if (!submittedMcqOption || submittedMcqOption.isCorrect !== 0) {
            await My.updateFirst(
              Tables.EXAM_RESULT,
              { score: existingResult.score - points },
              where,
              whereParams
            );
          }
        }
      }
    } else {
      if (!mcqOption || mcqOption.isCorrect !== 1) {
        await My.insert(Tables.EXAM_RESULT, {
          id: Utils.generateUUID(),
          examId,
          userId,
          score: 0.0,
        });
        return "wrong";
      } else {
        await My.insert(Tables.EXAM_RESULT, {
          id: Utils.generateUUID(),
          examId,
          userId,
          score: points,
        });
      }
    }
  }
  private async updateTestTempResult(
    examId: string,
    userId: string,
    questionId: string,
    mcqId: string,
    submission
  ) {
    const where = `examId = ? AND userId = ?`;
    const whereParams = [examId, userId];

    // Retrieve points for the question and check if it's correct
    const question = await My.first(Tables.QUESTION, ["points"], `id = ?`, [
      questionId,
    ]);
    const mcqOption = await My.first(
      Tables.MCQ_OPTION,
      ["isCorrect"],
      `id = ?`,
      [mcqId]
    );

    if (!question || !question.points) {
      return null;
    }
    const points = question.points;

    // Check if an entry exists in EXAM_RESULTS
    const existingResult = await My.first(
      Tables.EXAM_RESULT,
      ["temp_score"],
      where,
      whereParams
    );
    if (existingResult) {
      console.log(mcqOption);

        if (
          !mcqOption ||
          (mcqOption.isCorrect !== 0)
        ) {
            console.log(mcqOption);
            if(existingResult.temp_score != null)
            {
            console.log(existingResult);
              await My.update(
                Tables.EXAM_RESULT,
                { temp_score: existingResult.temp_score + points },
                where,
                whereParams
                );
            } else {
              await My.update(
                Tables.EXAM_RESULT,
                { temp_score: points },
                where,
                whereParams
                );
            }
        }
    } else {
      await this.updateExamResultOnUpdateSubmission(
        examId,
        userId,
        questionId,
        mcqId,
        submission
      );
    }
  }
  public testComplete = async (
    examId: string,
    userId: string
  ) => {
    const where = `examId = ? AND userId = ?`;
    const whereParams = [examId, userId];
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const result = await My.update(
      Tables.EXAM_RESULT,
      { completedAt: currentTimestamp },
      where,
      whereParams
    );

    return result;
  };
}
