import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Media } from "../../../helpers/media";
import { Utils } from "../../../helpers/utils";

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
  public getById = async (currentAffairsId: string) => {
    const currentAffair = await My.first(
      Tables.CURRENT_AFFAIRS,
      [
        "id",
        "title",
        "lang",
        "content",
        "status",
        "attachment",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "id=?",
      [currentAffairsId]
    );

    currentAffair.attachment = Utils.getImagePath(currentAffair.attachment);

    return currentAffair;
  };

  /**
   * Get All Current Affairs
   * @param currentAffairsDetails
   * @returns
   */
  public getAllCurrentAffairs = async () => {
    const currentAffairs = await My.findAll(
      Tables.CURRENT_AFFAIRS,
      [
        "id",
        "title",
        "lang",
        "content",
        "status",
        "attachment",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status NOT IN (?)",
      ["deleted"]
    );

    currentAffairs.map((currentAffair) => {
      currentAffair.attachment = Utils.getImagePath(currentAffair.attachment);
      return currentAffair;
    });

    return currentAffairs;
  };

  /**
   * Get All Current Affairs
   * @param currentAffairsDetails
   * @returns
   */
  public getAllCurrentAffairsByLanguage = async (lang: String) => {
    const currentAffairs = await My.findAll(
      Tables.CURRENT_AFFAIRS,
      [
        "id",
        "title",
        "lang",
        "content",
        "status",
        "attachment",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status=? AND lang=?",
      ["published",lang]
    );

    currentAffairs.map((currentAffair) => {
      currentAffair.attachment = Utils.getImagePath(currentAffair.attachment);
      return currentAffair;
    });
    delete currentAffairs.lang;
    return currentAffairs;
  };

  /**
   * Current Affair Status changed to Deleted by ID
   * @param currentAffairsDetails
   * @returns
   */
  public destroy = async (currentAffairsId: string) => {
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const currentAffair = await My.update(
      Tables.CURRENT_AFFAIRS,
      { status: "deleted", deleted_at: currentTimestamp },
      "id=?",
      [currentAffairsId]
    );

    this.deleteImage(currentAffairsId);

    return currentAffair;
  };

  /**
   * Current Affair Status changed to Draft and remove data of deleted_at column by ID
   * @param currentAffairsDetails
   * @returns
   */
  public restoreCurrentAffair = async (currentAffairsId: string) =>
    await My.update(
      Tables.CURRENT_AFFAIRS,
      { status: "draft", deleted_at: null },
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

  public deleteImage = async (currentAffairId: string) => {
    const currentAffair = await My.first(
      Tables.CURRENT_AFFAIRS,
      ["id", "attachment"],
      "id = ?",
      [currentAffairId]
    );
    if (currentAffair.attachment) {
      Media.deleteImage(currentAffair.attachment);
    }
    return;
  };
}
