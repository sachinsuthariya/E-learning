import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class CourseCategoriesUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Category
  public create = (categoryDetails: Json) =>
    My.insert(Tables.CATEGORY, categoryDetails);

  /**
   * Get Category by ID
   * @param categoryDetails
   * @returns
   */
  public getById = async (categoryId: string) =>
    await My.first(
      Tables.CATEGORY,
      ["id", "title","status","created_at", "updated_at","deleted_at"],
      "id=?",
      [categoryId]
    );

  /**
   * Get All Categorys
   * @param categoryDetails
   * @returns
   */
  public getAllCategories = async () => {
    const getAllCategories = await My.findAll(Tables.CATEGORY, [
      "id",
      "title",
      "status",
      "created_at",
      "updated_at",
      "deleted_at",
    ],
    "status!=?",
    ["deleted"]
    );

    return getAllCategories;
  };

  /**
   * Category Status changed to Deleted by ID
   * @param categoryDetails
   * @returns
   */
  public destroy = async (categoryId: string) => {
    const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedRecord = await My.update(
      Tables.CATEGORY,
      { status: "deleted", deleted_at: currentTimestamp},
      "id=?",
      [categoryId]
    );

    return updatedRecord;

  };

  /**
   * Category Status changed to Active and remove data of deleted_at column by ID
   * @param categoryDetails
   * @returns
   */
  public restoreCategory = async (categoryId: string) => 
    await My.update(
      Tables.CATEGORY,
      { status: "active", deleted_at: null},
      "id=?",
      [categoryId]
    );

  /**
   * Category Update Fields by ID
   * @param categoryId string
   * @param categoryDetails Json
   * @returns
   */
  public updateById = async (
    categoryId: string,
    categoryDetails: Json
  ) =>
    await My.update(Tables.CATEGORY, categoryDetails, "id=?", [
      categoryId,
    ]);
}
