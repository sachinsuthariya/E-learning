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

  public getAllQuestions = async () => {
    const questionsWithExamNames = await My.findAll(Tables.QUESTION, [
      "id",
      "examId",
      "question",
      "questionType",
      "points",
      "nagativePoints",
    ]);
  
    // Now, let's fetch the related exam names for each question
    for (const question of questionsWithExamNames) {
      const exam = await My.first(Tables.EXAM, ["title"], "id = ?", [question.examId]);
      question.examName = exam ? exam.title : null;
    }
  
    return questionsWithExamNames;
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
