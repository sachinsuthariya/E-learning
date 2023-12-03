import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { AppUpdateUtils } from "./appUpdateUtils";
import { Utils } from "../../../helpers/utils";
import { UploadedFile } from "express-fileupload";
import { Media } from "../../../helpers/media";
import { FileTypes } from "../../../config/enums";

export class AppUpdateController {
  private appUpdateUtils: AppUpdateUtils = new AppUpdateUtils();

  public create = async (req: any, res: Response) => {
    try {
      console.log(req.body);
      // return req.body;
      const AppUpdate = await this.appUpdateUtils.getAllAppUpdate();
      if(!AppUpdate){
        req.body.id = Utils.generateUUID();
        const app = req.files.file;
        if (app) {
          req.body.file = Media.uploadDocument(app, FileTypes.APP_UPDATE)
        }
        const appDetails: any = {
          id: req.body.id,
          version: req.body.version,
          release_notes: req.body.release_notes,
          url: req.body.url,
          file: req.body.file
        }
        // console.log(app);
        // return appDetails;
        await this.appUpdateUtils.create(appDetails);
        const AppUpdate = await this.appUpdateUtils.getById(
          req.body.id
        );
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS"),
          AppUpdate
        );
        return res.status(response.code).json(response);
      } else {
        const file = req.files.file;
        if (file) {
          await this.appUpdateUtils.deleteDocument(AppUpdate.id);
          req.body.file = Media.uploadDocument(file, FileTypes.APP_UPDATE);

          const appUpdateId = AppUpdate.id;
          const appUpdateDetails: any = {
            version: req.body.version,
            release_notes: req.body.release_notes,
            url: req.body.url,
            file: req.body.file
          }
    
          const updateAppUpdate = await this.appUpdateUtils.updateById(
            appUpdateId,
            appUpdateDetails
          );
          const response = ResponseBuilder.genSuccessResponse(
            Constants.SUCCESS_CODE,
            req.t("SUCCESS"),
            updateAppUpdate
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
  public allAppUpdate = async (req: any, res: Response) => {
    try {
      const AppUpdate =
        await this.appUpdateUtils.getAllAppUpdate();

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        AppUpdate
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
      const appUpdate = await this.appUpdateUtils.deleteDocument(id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_APP_UPDATE_DELETE"),
        appUpdate
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
