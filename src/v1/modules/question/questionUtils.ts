import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class QuestionUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  /**
   * Add exam question
   * @param questionDetails
   * @returns
   */
  public create = (questionDetails: Json) =>
    My.insert(Tables.QUESTION, questionDetails);

  public addQuestionOptions = (mcqOptionsDetails: Json[]) =>
    My.insertMany(Tables.MCQ_OPTION, mcqOptionsDetails);

  /**
   * Get question details
   * @param questionId string
   * @returns Promise<any>
   */
  public getById = async (questionId: string): Promise<any> => {
    const model = `${Tables.QUESTION} as q
      INNER JOIN ${Tables.EXAM} as e ON q.examId = e.id`;
    const field = [
      "q.id",
      "q.question",
      "q.questionType",
      "q.points",
      "q.nagativePoints",
      "e.id AS examId",
      "e.title as examTitle",
    ];
    const question = await My.first(model, field, "q.id = ?", [questionId]);
    const mcqOptions = await My.findAll(
      Tables.MCQ_OPTION,
      ["id", "questionId", "optionText", "isCorrect"],
      "questionId = ?",
      [questionId]
    );

    return {
      ...question,
      mcqOptions,
    };
  };

  public getAllQuestion = async () => {
    const getAllExams = await My.findAll(Tables.QUESTION, [
      "id",
      "examId",
      "question",
      "questionType",
      "points",
      "nagativePoints",
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

  /**
   * Update question
   * @param questionId
   * @param questionDetails
   * @returns
   */
  public updateById = async (questionId: string, questionDetails: Json) =>
    await My.update(Tables.QUESTION, questionDetails, "id=?", [questionId]);
}
