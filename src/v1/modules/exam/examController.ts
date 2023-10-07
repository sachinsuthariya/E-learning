import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { ExamUtils } from "./examUtils";
import { Utils } from "../../../helpers/utils";

export class ExamController {
    private examUtils: ExamUtils = new ExamUtils();

    public create = async (req: any, res: Response) => {
        try {
            req.body.id = Utils.generateUUID();
            await this.examUtils.create(req.body);
            const exam = await this.examUtils.getById(req.body.id)
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public getById = async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const exam = await this.examUtils.getById(id);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public allExams = async (req: any, res: Response) => {
        try {
            const getAllExams = await this.examUtils.getAllExams();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllExams);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public update = async (req: any, res: Response) => {
        try {
            const examId = req.params.id;
            const examDetails = {
                title: req.body.title,
                description: req.body.description,
                exam_date: req.body.exam_date,
                duration_minutes: req.body.duration_minutes,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                pass_marks: req.body.pass_marks,

            }

            const updateExam = await this.examUtils.updateById(examId, examDetails);
            
            if (!updateExam || !updateExam.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("EXAM_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const exam = await this.examUtils.getById(examId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
}
