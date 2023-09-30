import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { CourseCategoriesUtils } from "./courseCategoriesUtils";
import { Utils } from "../../../helpers/utils";

export class CourseCategoriesController {
    private courseCategoriesUtils: CourseCategoriesUtils = new CourseCategoriesUtils();

    public create = async (req: any, res: Response) => {
        try {
            req.body.id = Utils.generateUUID();
            await this.courseCategoriesUtils.create(req.body);
            const categories = await this.courseCategoriesUtils.getById(req.body.id)
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), categories);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public allCategories = async (req: any, res: Response) => {
        try {
            const getAllCategories = await this.courseCategoriesUtils.getAllCategories();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllCategories);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public delete = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const category = await this.courseCategoriesUtils.destroy(id);

            if (!category || !category.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                return res.status(response.code).json(response);                
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CATEGORY_DELETE"), category);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public restore = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const category = await this.courseCategoriesUtils.restoreCategory(id);

            if (!category || !category.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                return res.status(response.code).json(response);                
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CATEGORY_RESTORE"), category);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public update = async (req: any, res: Response) => {
        try {
            const categoryId = req.params.id;
            const categoryDetails = {
                title: req.body.title
            }

            const updateCategory = await this.courseCategoriesUtils.updateById(categoryId, categoryDetails);
            
            if (!updateCategory || !updateCategory.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CATEGORY_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const category = await this.courseCategoriesUtils.getById(categoryId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    };
    
    public updateStatus = async (req: any, res: Response) => {
        try {
            const categoryId = req.params.id;
            const categoryDetails = {
                status: req.body.status
            }

            const updateCategory = await this.courseCategoriesUtils.updateById(categoryId, categoryDetails);
            
            if (!updateCategory || !updateCategory.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CATEGORY_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const category = await this.courseCategoriesUtils.getById(categoryId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    };

}
