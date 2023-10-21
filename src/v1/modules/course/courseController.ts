import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { CourseUtils } from "./courseUtils";
import { Utils } from "../../../helpers/utils";

export class CourseController {
    private courseUtils: CourseUtils = new CourseUtils();

    public create = async (req: any, res: Response) => {
        try {
            req.body.id = Utils.generateUUID();
            await this.courseUtils.create(req.body);
            const course = await this.courseUtils.getById(req.body.id)
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public getById = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const course = await this.courseUtils.getById(id);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public allCourses = async (req: any, res: Response) => {
        try {
            const getAllCourses = await this.courseUtils.getAllCourses();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllCourses);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public delete = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const course = await this.courseUtils.destroy(id);

            if (!course || !course.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                return res.status(response.code).json(response);                
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CURRENT_AFFAIR_DELETE"));
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public restore = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const course = await this.courseUtils.restoreCourse(id);

            if (!course || !course.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.FAIL_CODE, req.t("INAVALID_REQUEST"));
                return res.status(response.code).json(response);                
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS_CURRENT_AFFAIR_RESTORE"));
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public update = async (req: any, res: Response) => {
        try {
            const courseId = req.params.id;
            const courseDetails = {
                title: req.body.title,
                description: req.body.description,
                category_id: req.body.category_id,
                isIncludesLiveClass: req.body.isIncludesLiveClass,
                isFree: req.body.isFree,
                materials: req.body.materials,
                price: req.body.price,
                payment_url: req.body.payment_url,
                material_price: req.body.material_price,
                status: req.body.status
            }

            const updateCourse = await this.courseUtils.updateById(courseId, courseDetails);
            
            if (!updateCourse || !updateCourse.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const course = await this.courseUtils.getById(courseId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    };
    
    public updateStatus = async (req: any, res: Response) => {
        try {
            const courseId = req.params.id;
            const courseDetails = {
                status: req.body.status
            }

            const updateCourses = await this.courseUtils.updateById(courseId, courseDetails);
            
            if (!updateCourses || !updateCourses.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("CURRENT_AFFAIR_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const course = await this.courseUtils.getById(courseId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), course);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    };

}
