import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Media } from "../../../helpers/media";
import { Utils } from "../../../helpers/utils";

export class AppAdvertiseUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Current Affairs
  public create = (AppAdvertiseDetails: Json) =>
    My.insert(Tables.APP_ADVERTISE, AppAdvertiseDetails);

  /**
   * Get Current Affair by ID
   * @param AppAdvertiseDetails
   * @returns
   */
  public getById = async (AppAdvertiseId: string) => {
    const appAdvertise = await My.first(
      Tables.APP_ADVERTISE,
      [
        "id",
        "name",
        "created_at",
        "updated_at"
      ],
      "id=?",
      [AppAdvertiseId]
    );

    appAdvertise.name = Utils.getImagePath(appAdvertise.name);

    return appAdvertise;
  };

  /**
   * Get All Current Affairs
   * @param AppAdvertiseDetails
   * @returns
   */
  public getAllAppAdvertise = async () => {
    const AppAdvertise = await My.first(
      Tables.APP_ADVERTISE,
      [
        "id",
        "name",
        "created_at",
        "updated_at",
      ]
    );

    AppAdvertise.name = Utils.getImagePath(AppAdvertise.name);

    return AppAdvertise;
  };

  /**
   * Current Affair Update Fields by ID
   * @param AppAdvertiseId string
   * @param AppAdvertiseDetails Json
   * @returns
   */
  public updateById = async (
    AppAdvertiseId: string,
    appAdvertiseDetails: Json
  ) =>
    await My.update(Tables.APP_ADVERTISE, appAdvertiseDetails, "id=?", [
      AppAdvertiseId,
    ]);

  public deleteImage = async (appAdvertiseId: string) => {
    const appAdvertise = await My.first(
      Tables.APP_ADVERTISE,
      ["id", "name"],
      "id = ?",
      [appAdvertiseId]
      );
      if (appAdvertise.name) {
        Media.deleteImage(appAdvertise.name);
      }
    return;
  };
}
