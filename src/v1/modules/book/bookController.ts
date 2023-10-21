import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { BookUtils } from "./bookUtils";
import { Utils } from "../../../helpers/utils";

export class BookController {
  private bookUtils: BookUtils = new BookUtils();

  public create = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      await this.bookUtils.create(req.body);
      const book = await this.bookUtils.getById(req.body.id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public getById = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const book = await this.bookUtils.getById(id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public allBooks = async (req: any, res: Response) => {
    try {
      const books = await this.bookUtils.getAllBooks();
      books.map((book) => {
        book.attachment = book.attachment
          ? {
              url: book.attachment,
              thumbnail: book.attachment,
            }
          : Constants.DEFAULT_IMAGE
        return book;
      });

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        books
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public delete = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const book = await this.bookUtils.destroy(id);

      if (!book || !book.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.FAIL_CODE,
          req.t("INAVALID_REQUEST")
        );
        return res.status(response.code).json(response);
      }

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_CURRENT_AFFAIR_DELETE")
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public restore = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const book = await this.bookUtils.restoreBook(id);

      if (!book || !book.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.FAIL_CODE,
          req.t("INAVALID_REQUEST")
        );
        return res.status(response.code).json(response);
      }

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_CURRENT_AFFAIR_RESTORE")
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public update = async (req: any, res: Response) => {
    try {
      const bookId = req.params.id;
      const bookDetails = {
        title: req.body.title,
        description: req.body.description,
        // category_id: req.body.category_id,
        // isIncludesLiveClass: req.body.isIncludesLiveClass,
        isFree: req.body.isFree,
        price: req.body.price,
        payment_url: req.body.payment_url,
        status: req.body.status,
      };

      const updateBook = await this.bookUtils.updateById(bookId, bookDetails);

      if (!updateBook || !updateBook.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const book = await this.bookUtils.getById(bookId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public updateStatus = async (req: any, res: Response) => {
    try {
      const bookId = req.params.id;
      const bookDetails = {
        status: req.body.status,
      };

      const updateBooks = await this.bookUtils.updateById(bookId, bookDetails);

      if (!updateBooks || !updateBooks.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const book = await this.bookUtils.getById(bookId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
}
