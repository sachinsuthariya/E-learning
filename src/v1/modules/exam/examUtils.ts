import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";
import { divide } from "lodash";

export class ExamUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Courses
  public create = (examDetails: Json) => My.insert(Tables.EXAM, examDetails);

  public getById = async (examId: string) =>
    await My.first(
      Tables.EXAM,
      [
        "id",
        "title",
        "description",
        "exam_date",
        "duration_minutes",
        "start_time",
        "end_time",
        "total_marks",
        "user_id",
        "created_at",
        "updated_at",
      ],
      "id=?",
      [examId]
    );

  // public getAllExams = async () => {
  //   const getAllExams = await My.findAll(Tables.EXAM, [
  //     "id", "title", "duration_minutes", "start_time", "end_time", "pass_marks", "created_at", "updated_at"
  //   ]);

  //   return getAllExams;
  // };
  public getAllExams = async () => {
    const getAllExams = await My.findAll(Tables.EXAM, [
      "id", "description", "title", "duration_minutes", "start_time", "end_time", "user_id","total_marks", "created_at", "updated_at", "exam_date"
    ]);

    const currentDate = new Date(); // Get the current date

    const pastExams = [];
    const presentExams = [];
    const futureExams = [];
    const noDateAvailableExams = [];

    getAllExams.forEach((exam) => {
      const examDate = new Date(exam.exam_date);
      const startTime = new Date(exam.start_time);

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
        futureExams.push(exam);
      } else {
        presentExams.push(exam);
      }
    });

    return {
      pastExams,
      presentExams,
      futureExams,
      noDateAvailableExams,
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
      const updatedExam = await My.update(Tables.EXAM, { user_id: JSON.stringify([userId]) }, "id=?", [examId]);
     
  } else {
      // Parse the existing user_ids as an array
      const existingUserIds = JSON.parse(exam.user_id);
      // console.log(existingUserIds);
      // Check if the current user's ID is not already in the array
      if (!existingUserIds.includes(userId)) {
          existingUserIds.push(userId);
  
          // Update the user_id column with the modified array
          const updatedExam = await My.update(Tables.EXAM, { user_id: JSON.stringify(existingUserIds) }, "id=?", [examId]);
        
      }
  }
    return exam;
  }
  public getExamQuestions = async (examId: string, userId: string) => {
    const model = `${Tables.QUESTION} AS q
      INNER JOIN ${Tables.MCQ_OPTION} AS mcq ON q.id = mcq.questionId
      LEFT JOIN ${Tables.STUDENT_EXAM_SUBMISSION} AS sub ON sub.questionId = q.id AND sub.userId = '${userId}'`;

    const condition = `q.examId = '${examId}'`;
    const fields = `q.id as id, q.question, q.questionType, q.points, q.nagativePoints, q.examId, sub.mcqId as selectedMCQ,
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
            mcqId
        };
        submittedAnswer = await My.updateFirst(Tables.STUDENT_EXAM_SUBMISSION, payload, where, whereParams);
        await this.updateExamResultOnUpdateSubmission(examId, userId, questionId, mcqId);
    } else {
        // Handle insert logic for new submission
        const payload = {
            id: Utils.generateUUID(),
            mcqId,
            questionId,
            examId,
            userId
          };
          submittedAnswer = await My.insert(Tables.STUDENT_EXAM_SUBMISSION, payload);
          await this.updateExamResultOnNewSubmission(examId, userId, questionId, mcqId);
    }

    // After submitting the answer, check if the MCQ is correct and adjust the score

    return submittedAnswer;
};

private async updateExamResultOnNewSubmission(examId: string, userId: string, questionId: string, mcqId: string) {
  const where = `examId = ? AND userId = ?`;
  const whereParams = [examId, userId];

  // Retrieve points for the question and check if it's correct
  const question = await My.first(Tables.QUESTION, ["points"], `id = ?`, [questionId]);
  const mcqOption = await My.first(Tables.MCQ_OPTION, ["isCorrect"], `id = ?`, [mcqId]);

  if (!question || !question.points){ 

      return null;
  }
  const points = question.points;

  // Check if an entry exists in EXAM_RESULTS
  const existingResult = await My.first(Tables.EXAM_RESULT, ["score"], where, whereParams);

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

      if (!mcqOption || mcqOption.isCorrect !== 0 || !existingSubmission || !existingSubmission.id) {
          await My.updateFirst(
              Tables.EXAM_RESULT,
              { score: existingResult.score + points },
              where,
              whereParams
          );
      }
  } else {
      if(!mcqOption || mcqOption.isCorrect !== 1) {
        await My.insert(Tables.EXAM_RESULT, {
          id: Utils.generateUUID(),
          examId,
          userId,
          score: 0.00,
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
private async updateExamResultOnUpdateSubmission(examId: string, userId: string, questionId: string, mcqId: string) {
  const where = `examId = ? AND userId = ?`;
  const whereParams = [examId, userId];

  // Retrieve points for the question and check if it's correct
  const question = await My.first(Tables.QUESTION, ["points"], `id = ?`, [questionId]);
  const mcqOption = await My.first(Tables.MCQ_OPTION, ["isCorrect"], `id = ?`, [mcqId]);

  if (!question || !question.points){ 
      return null;
  }
  const points = question.points;

  // Check if an entry exists in EXAM_RESULTS
  const existingResult = await My.first(Tables.EXAM_RESULT, ["score"], where, whereParams);

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
         if(!mcqOption || mcqOption.isCorrect !== 0) {
          await My.updateFirst(
              Tables.EXAM_RESULT,
              { score: existingResult.score + points },
              where,
              whereParams
          );
        } else if(!mcqOption || mcqOption.isCorrect !== 1) {
          await My.updateFirst(
              Tables.EXAM_RESULT,
              { score: existingResult.score - points },
              where,
              whereParams
          );
        }
      }

  } else {

      if(!mcqOption || mcqOption.isCorrect !== 1) {
        await My.insert(Tables.EXAM_RESULT, {
          id: Utils.generateUUID(),
          examId,
          userId,
          score: 0.00,
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


}