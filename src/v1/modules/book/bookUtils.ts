import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";
import * as path from "path";
import * as fs from "fs";
import { Media } from "../../../helpers/media";
export class BookUtils {
  public sqlUtils: SqlUtils = new SqlUtils();

  // Create Books
  public create = (bookDetails: Json) => My.insert(Tables.BOOK, bookDetails);

  /**
   * Get Book by ID
   * @param bookDetails
   * @returns
   */
  public getById = async (bookId: string) => {
    const book = await My.first(
      Tables.BOOK,
      [
        "id",
        "title",
        "description",
        "isFree",
        "payment_url",
        "price",
        "status",
        "attachment",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "id=?",
      [bookId]
    );
    book.attachment = Utils.getImagePath(book.attachment);
    return book;
  };

  /**
   * Get All Books
   * @param bookDetails
   * @returns
   */
  public getAllBooks = async () => {
    const getAllBooks = await My.findAll(
      Tables.BOOK,
      [
        "id",
        "title",
        "description",
        "isFree",
        "price",
        "payment_url",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
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
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const book = await My.update(
      Tables.BOOK,
      { status: "deleted", attachment: null, deleted_at: currentTimestamp },
      "id=?",
      [bookId]
    );
    this.deleteImage(bookId);
    return book;
  };

  /**
   * Book Status changed to Draft and remove data of deleted_at column by ID
   * @param bookDetails
   * @returns
   */
  public restoreBook = async (bookId: string) =>
    await My.update(
      Tables.BOOK,
      { status: "active", deleted_at: null },
      "id=?",
      [bookId]
    );

  /**
   * Book Update Fields by ID
   * @param bookId string
   * @param bookDetails Json
   * @returns
   */
  public updateById = async (bookId: string, bookDetails: Json) =>
    await My.update(Tables.BOOK, bookDetails, "id=?", [bookId]);

  public deleteImage = async (bookId: string) => {
    const book = await My.first(Tables.BOOK, ["id", "attachment"], "id = ?", [
      bookId,
    ]);
    if (book.attachment) {
      Media.deleteImage(book.attachment);
    }
    return;
  };
}
