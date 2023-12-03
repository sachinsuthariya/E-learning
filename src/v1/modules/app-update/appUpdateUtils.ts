import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Media } from "../../../helpers/media";
import { Utils } from "../../../helpers/utils";

export class AppUpdateUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Current Affairs
  public create = (AppUpdateDetails: Json) =>{
  // return AppUpdateDetails;
    My.insert(Tables.APP_UPDATE, AppUpdateDetails);
  };
  /**
   * Get Current Affair by ID
   * @param AppUpdateDetails
   * @returns
   */
  public getById = async (AppUpdateId: string) => {
    const appUpdate = await My.first(
      Tables.APP_UPDATE,
      [
        "id",
        "release_notes",
        "url",
        "version",
        "file",
        "created_at",
        "updated_at"
      ],
      "id=?",
      [AppUpdateId]
    );

    appUpdate.file = Utils.getDocumentPath(appUpdate.file);

    return appUpdate;
  };

  /**
   * Get All Current Affairs
   * @param AppUpdateDetails
   * @returns
   */
  public getAllAppUpdate = async () => {
    const appUpdate = await My.first(
      Tables.APP_UPDATE,
      [
        "id",
        "release_notes",
        "url",
        "version",
        "file",
        "created_at",
        "updated_at"
      ]
    );
    if (appUpdate.file) {
      appUpdate.file = Utils.getDocumentPath(appUpdate.file);
    }

    return appUpdate;
  };

  /**
   * Current Affair Update Fields by ID
   * @param AppUpdateId string
   * @param AppUpdateDetails Json
   * @returns
   */
  public updateById = async (
    AppUpdateId: string,
    appUpdateDetails: Json
  ) =>
    await My.update(Tables.APP_UPDATE, appUpdateDetails, "id=?", [
      AppUpdateId,
    ]);

  public deleteDocument = async (appUpdateId: string) => {
    const appUpdate = await My.first(
      Tables.APP_UPDATE,
      ["id", "file"],
      "id = ?",
      [appUpdateId]
      );
      if (appUpdate.file) {
        Media.deleteDocument(appUpdate.file);
      }
    return;
  };
}
