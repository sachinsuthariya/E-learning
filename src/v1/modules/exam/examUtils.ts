import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";
import { divide } from "lodash";
import { Media } from "../../../helpers/media";

export class ExamUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Courses
  public create = (examDetails: Json) => My.insert(Tables.EXAM, examDetails);

  public getById = async (examId: string) => {
    const exam = await My.first(
      Tables.EXAM,
      [
        "id",
        "title",
        "description",
        "exam_date",
        "duration_minutes",
        "start_time",
        "end_time",
        "attachment",
        "total_marks",
        "user_id",
        "created_at",
        "updated_at",
      ],
      "id=?",
      [examId]
    );
    exam.attachment = Utils.getImagePath(exam.attachment);
    return exam;
  };

  // public getAllExams = async () => {
  //   const getAllExams = await My.findAll(Tables.EXAM, [
  //     "id", "title", "duration_minutes", "start_time", "end_time", "pass_marks", "created_at", "updated_at"
  //   ]);

  //   return getAllExams;
  // };
  public getAllExams = async (loginUserId: string) => {
    const getAllExams = await My.findAll(Tables.EXAM, [
      "id",
      "description",
      "title",
      "duration_minutes",
      "start_time",
      "end_time",
      "attachment",
      "user_id",
      "total_marks",
      "created_at",
      "updated_at",
      "exam_date",
    ]);

    const currentDate = new Date(); // Get the current date

    const pastExams = [];
    let presentExams = [];
    const presentExamsArr = [];
    const futureExamsArr = [];
    const noDateAvailableExams = [];

    getAllExams.forEach((exam) => {
      const examDate = new Date(exam.exam_date);
      const startTime = new Date(exam.start_time);

      exam.attachment = Utils.getImagePath(exam.attachment);

      // Extract only the date portion for comparison
      const currentDateOnly = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const examDateOnly = new Date(
        examDate.getFullYear(),
        examDate.getMonth(),
        examDate.getDate()
      );
      const startTimeOnly = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate()
      );

      if (examDate.toString() === "Invalid Date") {
        noDateAvailableExams.push(exam);
      } else if (startTimeOnly < currentDateOnly) {
        pastExams.push(exam);
      } else if (startTimeOnly > currentDateOnly) {
        futureExamsArr.push(exam);
      } else {
        presentExamsArr.push(exam);
      }
      presentExams = presentExamsArr.concat(futureExamsArr);
      // Check if the loginUserId is enrolled in the exam
      try {
        const userIdArray = JSON.parse(exam.user_id);

        exam.isEnrolledUser = userIdArray.includes(loginUserId) ? true : false;
      } catch (error) {
        exam.isEnrolledUser = false;
      }
      // Remove the "user_id" field from the exam response
      delete exam.user_id;
    });

    return {
      // pastExams,
      presentExams,
      // futureExams,
      // noDateAvailableExams,
    };
  };

  public updateById = async (examId: string, examDetails: Json) => {
    const updatedExam = await My.update(Tables.EXAM, examDetails, "id=?", [
      examId,
    ]);
    return updatedExam;
  };
  public userEnrollment = async (examId: string, userId: string) => {
    const exam = await this.getById(examId);
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
      // console.log(existingUserIds);
      // Check if the current user's ID is not already in the array
      if (!existingUserIds.includes(userId)) {
        existingUserIds.push(userId);

        // Update the user_id column with the modified array
        const updatedExam = await My.update(
          Tables.EXAM,
          { user_id: JSON.stringify(existingUserIds) },
          "id=?",
          [examId]
        );
      }
    }
    return exam;
  };
  public getExamQuestions = async (examId: string, userId: string) => {
    const model = `${Tables.QUESTION} AS q
      INNER JOIN ${Tables.EXAM} AS e ON e.id = q.examId
      INNER JOIN ${Tables.MCQ_OPTION} AS mcq ON q.id = mcq.questionId
      LEFT JOIN ${Tables.STUDENT_EXAM_SUBMISSION} AS sub ON sub.questionId = q.id AND sub.userId = '${userId}'`;

    const condition = `q.examId = '${examId}'`;
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
    let submittedAnswer;

    if (submission && submission.id) {
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
  public getResult = async (examId: string, userId: string) =>
    await My.first(
      Tables.EXAM_RESULT,
      ["id", "score"],
      "examId=? AND userId=?",
      [examId, userId]
    );
  public userEnrolledExams = async (loginUserId: string) => {
    const getAllExams = await My.findAll(Tables.EXAM, [
      "id",
      "description",
      "title",
      "duration_minutes",
      "start_time",
      "end_time",
      "user_id",
      "total_marks",
      "created_at",
      "updated_at",
      "exam_date",
    ]);

    // return getAllExams;
    const userExams = [];

    getAllExams.forEach((exam) => {
      try {
        const userIdArray = JSON.parse(exam.user_id);
        if (Array.isArray(userIdArray)) {
          if (userIdArray.includes(loginUserId)) {
            // Include the exam in the result only if loginUserId is enrolled
            userExams.push(exam);
          }
        } else {
          console.log(`Invalid user_id format for exam ${exam.id}`);
        }
      } catch (error) {
        // Handle JSON parsing error, e.g., if the "user_id" is not a valid JSON array
        console.error(`Error parsing user_id for exam ${exam.id}:`, error);
      }
    });

    return userExams;
  };

  public deleteImage = async (examId: string) => {
    const exam = await My.first(Tables.EXAM, ["id", "attachment"], "id = ?", [
      examId,
    ]);
    if (exam.attachment) {
      Media.deleteImage(exam.attachment);
    }
    return;
  };
}
