"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const sqlUtils_1 = require("../../../helpers/sqlUtils");
class BookUtils {
    constructor() {
        this.sqlUtils = new sqlUtils_1.SqlUtils();
        // Create Books
        this.create = (bookDetails) => My.insert(tables_1.Tables.BOOK, bookDetails);
        /**
         * Get Book by ID
         * @param bookDetails
         * @returns
         */
        this.getById = (bookId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.first(tables_1.Tables.BOOK, ["id", "title", "description", "isFree", "payment_url", "price", "status", "created_at", "updated_at", "deleted_at"], "id=?", [bookId]);
        });
        /**
         * Get All Books
         * @param bookDetails
         * @returns
         */
        this.getAllBooks = () => __awaiter(this, void 0, void 0, function* () {
            const getAllBooks = yield My.findAll(tables_1.Tables.BOOK, [
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
            ], "status!=?", ["deleted"]);
            return getAllBooks;
        });
        /**
         * Book Status changed to Deleted by ID
         * @param bookDetails
         * @returns
         */
        this.destroy = (bookId) => __awaiter(this, void 0, void 0, function* () {
            const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const updatedRecord = yield My.update(tables_1.Tables.BOOK, { status: "deleted", deleted_at: currentTimestamp }, "id=?", [bookId]);
            return updatedRecord;
        });
        /**
         * Book Status changed to Draft and remove data of deleted_at column by ID
         * @param bookDetails
         * @returns
         */
        this.restoreBook = (bookId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.BOOK, { status: "active", deleted_at: null }, "id=?", [bookId]);
        });
        /**
         * Book Update Fields by ID
         * @param bookId string
         * @param bookDetails Json
         * @returns
         */
        this.updateById = (bookId, bookDetails) => __awaiter(this, void 0, void 0, function* () {
            return yield My.update(tables_1.Tables.BOOK, bookDetails, "id=?", [
                bookId,
            ]);
        });
    }
}
exports.BookUtils = BookUtils;
//# sourceMappingURL=bookUtils.js.map