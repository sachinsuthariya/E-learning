import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";
import * as path from "path";
import * as fs from "fs";
import { Media } from "../../../helpers/media";
import { UserUtils } from "../user/userUtils";
export class BookUtils {
  public sqlUtils: SqlUtils = new SqlUtils();
  private userUtils: UserUtils = new UserUtils();

  // Create Books
  public create = (bookDetails: Json) => My.insert(Tables.BOOK, bookDetails);


  // Create Course Enquiries
  public createEnquiry = (enqiryDetails: Json) =>
  My.insert(Tables.BOOK_ENQUIRY, enqiryDetails);

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

  public getByIdStudent = async (bookId: string) => {
    const book = await My.first(
      Tables.BOOK,
      [
        "id",
        "title",
        "user_id",
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
    const books = await My.findAll(
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

    books.map((book) => {
      book.attachment = Utils.getImagePath(book.attachment)
      return book;
    });

    return books;
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
  public studentEnrollment = async (bookId: string, studentId: string) => {
    const book = await this.getByIdStudent(bookId);
    
    if (!book || !book.user_id) {
      const updatedExam = await My.update(
        Tables.BOOK,
        { user_id: JSON.stringify([studentId]) },
        "id=?",
        [bookId]
      );
    } else {
      const existingUserIds = JSON.parse(book.user_id);
      if (!existingUserIds.includes(studentId)) {
        existingUserIds.push(studentId);

        const updatedExam = await My.update(
          Tables.BOOK,
          { user_id: JSON.stringify(existingUserIds) },
          "id=?",
          [bookId]
        );
      }
    }
    return book;
  };
  public bookEnrolledStudents = async (bookId: string) => {
    const book = await this.getByIdStudent(bookId);
    const userIds = book.user_id;
    const students = await this.userUtils.getAllStudents();

    const filteredStudents = students.filter(student => userIds.includes(student.id));

    return [filteredStudents,{"book":book.title}];
  };
  public userEnrolledBooks = async (loginUserId: string) => {
    const getAllBooks = await My.findAll(Tables.BOOK, [
      "id",
        "title",
        "user_id",
        "description",
        "isFree",
        "payment_url",
        "price",
        "status",
        "attachment",
        "created_at",
        "updated_at",
        "deleted_at",
    ]);

    // return getAllBooks;
    const userBooks = [];

    getAllBooks.forEach((book) => {
      // console.log(book);
      try {
        const userIdArray = JSON.parse(book.user_id);
        if (Array.isArray(userIdArray)) {
          if (userIdArray.includes(loginUserId)) {
            userBooks.push(book);
          }
        } else {
          console.log(`Invalid user_id format for book ${book.id}`);
        }
      } catch (error) {
        // Handle JSON parsing error, e.g., if the "user_id" is not a valid JSON array
        console.error(`Error parsing user_id for book ${book.id}:`, error);
      }
    });

    return userBooks;
  };
}
