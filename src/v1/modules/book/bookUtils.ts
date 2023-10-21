import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class BookUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Books
  public create = (bookDetails: Json) =>
    My.insert(Tables.BOOK, bookDetails);

  /**
   * Get Book by ID
   * @param bookDetails
   * @returns
   */
  public getById = async (bookId: string) =>
    await My.first(
      Tables.BOOK,
      ["id", "title", "description", "isFree", "payment_url", "price", "status", "created_at", "updated_at", "deleted_at"],
      "id=?",
      [bookId]
    );

  /**
   * Get All Books
   * @param bookDetails
   * @returns
   */
  public getAllBooks = async () => {
    const getAllBooks = await My.findAll(Tables.BOOK, [
      "id",
      "title",
      "description",
      "isFree",
      "price",
      "payment_url",
      "status",
      "created_at",
      "updated_at",
      "deleted_at"
    ],
    "status!=?",
    ["deleted"]
    );

    return getAllBooks;
  };

  /**
   * Book Status changed to Deleted by ID
   * @param bookDetails
   * @returns
   */
  public destroy = async (bookId: string) => {
    const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedRecord = await My.update(
      Tables.BOOK,
      { status: "deleted", deleted_at: currentTimestamp},
      "id=?",
      [bookId]
    );

    return updatedRecord;

  };

  /**
   * Book Status changed to Draft and remove data of deleted_at column by ID
   * @param bookDetails
   * @returns
   */
  public restoreBook = async (bookId: string) => 
    await My.update(
      Tables.BOOK,
      { status: "active", deleted_at: null},
      "id=?",
      [bookId]
    );

  /**
   * Book Update Fields by ID
   * @param bookId string
   * @param bookDetails Json
   * @returns
   */
  public updateById = async (
    bookId: string,
    bookDetails: Json
  ) =>
    await My.update(Tables.BOOK, bookDetails, "id=?", [
      bookId,
    ]);
}
