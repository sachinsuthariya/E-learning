import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class CurrentAffairsUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Current Affairs
  public create = (currentAffairsDetails: Json) =>
    My.insert(Tables.CURRENT_AFFAIRS, currentAffairsDetails);

  /**
   * Get Current Affair by ID
   * @param currentAffairsDetails
   * @returns
   */
  public getById = async (currentAffairsId: string) =>
    await My.first(
      Tables.CURRENT_AFFAIRS,
      ["id", "title", "content", "status", "created_at", "updated_at","deleted_at"],
      "id=?",
      [currentAffairsId]
    );

  /**
   * Get All Current Affairs
   * @param currentAffairsDetails
   * @returns
   */
  public getAllCurrentAffairs = async () => {
    const getAllCurrentAffairs = await My.findAll(Tables.CURRENT_AFFAIRS, [
      "id",
      "title",
      "content",
      "status",
      "created_at",
      "updated_at",
      "deleted_at"
    ]);

    return getAllCurrentAffairs;
  };

  /**
   * Current Affair Status changed to Deleted by ID
   * @param currentAffairsDetails
   * @returns
   */
  public destroy = async (currentAffairsId: string) => {
    const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedRecord = await My.update(
      Tables.CURRENT_AFFAIRS,
      { status: "deleted", deleted_at: currentTimestamp},
      "id=?",
      [currentAffairsId]
    );

    return updatedRecord;

  };

  /**
   * Current Affair Status changed to Draft and remove data of deleted_at column by ID
   * @param currentAffairsDetails
   * @returns
   */
  public restoreCurrentAffair = async (currentAffairsId: string) => 
    await My.update(
      Tables.CURRENT_AFFAIRS,
      { status: "draft", deleted_at: null},
      "id=?",
      [currentAffairsId]
    );

  /**
   * Current Affair Update Fields by ID
   * @param currentAffairsId string
   * @param currentAffairsDetails Json
   * @returns
   */
  public updateById = async (
    currentAffairsId: string,
    currentAffairDetails: Json
  ) =>
    await My.update(Tables.CURRENT_AFFAIRS, currentAffairDetails, "id=?", [
      currentAffairsId,
    ]);
}
