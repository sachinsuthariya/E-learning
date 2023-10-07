import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class UserUtils {
  // Create User
  public createUser = (userDetails: any) =>
    My.insert(Tables.USER, userDetails);

  /**
   * Get User by ID
   * @param userId
   * @returns
   */
  public getUserById = async (userId: string) =>
    await My.first(
      Tables.USER,
      ["id", "firstName", "lastName", "email", "mobile", "role", "status"],
      "id=?",
      [userId]
    );

  /**
   * Get All Users
   * @returns
   */
  public getAllUsers = async () => {
    const getAllUsers = await My.findAll(Tables.USER, [
      "id",
      "firstName",
      "lastName",
      "email",
      "mobile",
      "role",
      "status"
    ]);

    return getAllUsers;
  };

  /**
   * Delete User by ID
   * @param userId
   * @returns
   */
  public deleteUser = async (userId: string) => {
    const deletedUser = await My.delete(Tables.USER, "id=?", [userId]);
    return deletedUser;
  };

  /**
   * Restore User by ID
   * @param userId
   * @returns
   */
  public restoreUser = async (userId: string) => {
    const restoredUser = await My.update(
      Tables.USER,
      { status: "active" },
      "id=?",
      [userId]
    );
    return restoredUser;
  };

  /**
   * Update User by ID
   * @param userId
   * @param userDetails
   * @returns
   */
  public updateUser = async (userId: string, userDetails: any) => {
    const updatedUser = await My.update(Tables.USER, userDetails, "id=?", [userId]);
    return updatedUser;
  };
}
