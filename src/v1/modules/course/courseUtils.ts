import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class CourseUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Courses
  public create = (courseDetails: Json) =>
    My.insert(Tables.COURSE, courseDetails);

  /**
   * Get Course by ID
   * @param courseDetails
   * @returns
   */
  public getById = async (courseId: string) =>
    await My.first(
      Tables.COURSE,
      ["id", "title", "description", "isIncludesLiveClass", "category_id", "isFree", "materials", "price", "attachment", "status", "created_at", "updated_at", "deleted_at"],
      "id=?",
      [courseId]
    );

  /**
   * Get All Courses
   * @param courseDetails
   * @returns
   */
  public getAllCourses = async () => {
    const getAllCourses = await My.findAll(Tables.COURSE, [
      "id",
      "title",
      "description",
      "isIncludesLiveClass",
      "category_id",
      "isFree",
      "materials",
      "price",
      "attachment",
      "status",
      "created_at",
      "updated_at",
      "deleted_at"
    ]);

    return getAllCourses;
  };

  /**
   * Course Status changed to Deleted by ID
   * @param courseDetails
   * @returns
   */
  public destroy = async (courseId: string) => {
    const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedRecord = await My.update(
      Tables.COURSE,
      { status: "deleted", deleted_at: currentTimestamp},
      "id=?",
      [courseId]
    );

    return updatedRecord;

  };

  /**
   * Course Status changed to Draft and remove data of deleted_at column by ID
   * @param courseDetails
   * @returns
   */
  public restoreCourse = async (courseId: string) => 
    await My.update(
      Tables.COURSE,
      { status: "active", deleted_at: null},
      "id=?",
      [courseId]
    );

  /**
   * Course Update Fields by ID
   * @param courseId string
   * @param courseDetails Json
   * @returns
   */
  public updateById = async (
    courseId: string,
    courseDetails: Json
  ) =>
    await My.update(Tables.COURSE, courseDetails, "id=?", [
      courseId,
    ]);
}
