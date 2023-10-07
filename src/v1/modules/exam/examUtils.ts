import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class ExamUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Courses
  public create = (examDetails: Json) =>
  My.insert(Tables.EXAM, examDetails);

  public getById = async (examId: string) =>
    await My.first(
      Tables.EXAM,
      ["id", "title", "exam_date", "duration_minutes", "start_time", "end_time", "pass_marks", "created_at", "updated_at"],
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
      "id", "title", "duration_minutes", "start_time", "end_time", "pass_marks", "created_at", "updated_at", "exam_date"
    ]);

    const currentDate = new Date(); // Get the current date

    const pastExams = [];
    const presentExams = [];
    const futureExams = [];
    const noDateAvailableExams = [];

    getAllExams.forEach(exam => {
      const examDate = new Date(exam.exam_date);
      const startTime = new Date(exam.start_time);

      // Extract only the date portion for comparison
      const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const examDateOnly = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
      const startTimeOnly = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());

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

  public updateById = async (
    examId: string,
    examDetails: Json
  ) => {
        const updatedExam = await My.update(Tables.EXAM, examDetails, "id=?", [
          examId,
        ]);
        return updatedExam;
      }
}
