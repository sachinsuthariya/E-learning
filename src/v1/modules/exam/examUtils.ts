import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";

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
        "pass_marks",
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
      "id",
      "title",
      "duration_minutes",
      "start_time",
      "end_time",
      "pass_marks",
      "created_at",
      "updated_at",
      "exam_date",
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
    const ans = await My.first(
      Tables.STUDENT_EXAM_SUBMISSION,
      ["id", "examId", "questionId", "mcqId", "userId"],
      where,
      whereParams
    );
    let submittedAnswer;

    if (ans && ans.id) {
      const payload = {
        mcqId
      }
      submittedAnswer = await My.updateFirst(Tables.STUDENT_EXAM_SUBMISSION, payload, where, whereParams)
    } else {
      const payload = {
        id: Utils.generateUUID(),
        mcqId,
        questionId,
        examId,
        userId
      }
      submittedAnswer = await My.insert(Tables.STUDENT_EXAM_SUBMISSION, payload)
    }
    return submittedAnswer
  };
}
