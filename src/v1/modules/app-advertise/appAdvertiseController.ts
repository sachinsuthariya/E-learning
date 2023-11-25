import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { AppAdvertiseUtils } from "./appAdvertiseUtils";
import { Utils } from "../../../helpers/utils";
import { UploadedFile } from "express-fileupload";
import { Media } from "../../../helpers/media";
import { FileTypes } from "../../../config/enums";

export class AppAdvertiseController {
  private AppAdvertiseUtils: AppAdvertiseUtils = new AppAdvertiseUtils();

  public create = async (req: any, res: Response) => {
    try {
      // console.log(req.body);
      // return req.files.image;
      const AppAdvertise = await this.AppAdvertiseUtils.getAllAppAdvertise();
      if(!AppAdvertise){
        req.body.id = Utils.generateUUID();
        const image = req.files.image;
        if (image) {
          req.body.name = Media.uploadImage(image, FileTypes.APP_ADVERTISE)
        }
        await this.AppAdvertiseUtils.create(req.body);
        const AppAdvertise = await this.AppAdvertiseUtils.getById(
          req.body.id
        );
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS"),
          AppAdvertise
        );
        return res.status(response.code).json(response);
      } else {
        const image = req.files.image;
        if (image) {
          await this.AppAdvertiseUtils.deleteImage(AppAdvertise.id);
          req.body.name = Media.uploadImage(image, FileTypes.APP_ADVERTISE);

          const appAdvertiseId = AppAdvertise.id;
          const appAdvertiseDetails = {
            name: req.body.name,
          };
    
          const updateAppAdvertise = await this.AppAdvertiseUtils.updateById(
            appAdvertiseId,
            appAdvertiseDetails
          );
          const response = ResponseBuilder.genSuccessResponse(
            Constants.SUCCESS_CODE,
            req.t("SUCCESS"),
            updateAppAdvertise
            );
            return res.status(response.code).json(response);
          }
          const response = ResponseBuilder.genErrorResponse(
            Constants.INTERNAL_SERVER_ERROR_CODE,
            req.t("ERR_INTERNAL_SERVER")
          );
          return res.status(response.error.code).json(response);
      }
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public allAppAdvertise = async (req: any, res: Response) => {
    try {
      const AppAdvertise =
        await this.AppAdvertiseUtils.getAllAppAdvertise();

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        AppAdvertise
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
  public delete = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const appAdvertise = await this.AppAdvertiseUtils.deleteImage(id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_APP_ADVERTISE_DELETE"),
        appAdvertise
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
