import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { CurrentAffairsUtils } from "./currentAffairsUtils";
import { Utils } from "../../../helpers/utils";
import { UploadedFile } from "express-fileupload";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs";
import { Media } from "../../../helpers/media";
import { FileTypes } from "../../../config/enums";

export class CurrentAffairsController {
  private currentAffairsUtils: CurrentAffairsUtils = new CurrentAffairsUtils();

  public create = async (req: any, res: Response) => {
    try {
      console.log(req.body);
      req.body.id = Utils.generateUUID();
      const image = req.files.image;
      if (image) {
        req.body.attachment = Media.uploadImage(image, FileTypes.CURRENT_AFFAIRS)
      }
      console.log(req.body);
      await this.currentAffairsUtils.create(req.body);
      const currentAffairs = await this.currentAffairsUtils.getById(
        req.body.id
      );

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        currentAffairs
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
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
      const currentAffair = await this.currentAffairsUtils.getById(id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        currentAffair
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
  public allCurrentAffairs = async (req: any, res: Response) => {
    try {
      const currentAffairs =
        await this.currentAffairsUtils.getAllCurrentAffairs();

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        currentAffairs
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
      const currentAffair = await this.currentAffairsUtils.destroy(id);

      if (!currentAffair || !currentAffair.affectedRows) {
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
      const currentAffair = await this.currentAffairsUtils.restoreCurrentAffair(
        id
      );

      if (!currentAffair || !currentAffair.affectedRows) {
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
      const currentAffairId = req.params.id;
      const image = req.files.image;
      const currentAffairDetails: any = {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
      };

      if (image) {
        currentAffairDetails.attachment = Media.uploadImage(
          image,
          FileTypes.COURSES
        );
        await this.currentAffairsUtils.deleteImage(currentAffairId);
      }

      const updateCurrentAffairs = await this.currentAffairsUtils.updateById(
        currentAffairId,
        currentAffairDetails
      );

      if (!updateCurrentAffairs || !updateCurrentAffairs.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const currentAffairs = await this.currentAffairsUtils.getById(
        currentAffairId
      );

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        currentAffairs
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
      const currentAffairId = req.params.id;
      const currentAffairDetails = {
        status: req.body.status,
      };

      const updateCurrentAffairs = await this.currentAffairsUtils.updateById(
        currentAffairId,
        currentAffairDetails
      );

      if (!updateCurrentAffairs || !updateCurrentAffairs.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const currentAffairs = await this.currentAffairsUtils.getById(
        currentAffairId
      );

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        currentAffairs
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

  public uploadFiles = async (req: any, res: Response) => {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploadedFile: UploadedFile = req.files.file;

      const file = Media.uploadImage(uploadedFile, req.body.type);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        { file }
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
