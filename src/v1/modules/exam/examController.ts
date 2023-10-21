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
            const loginUserId = req.user && req.user.id ? req.user.id : null;

            const getAllExams = await this.examUtils.getAllExams(loginUserId);
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllExams);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public enrolledExams = async (req: any, res: Response) => {
        try {
            const loginUserId = req.user && req.user.id ? req.user.id : null;
            // return loginUserId;
            const enrolledExams = await this.examUtils.userEnrolledExams(loginUserId);
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), enrolledExams);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err)
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
                total_marks: req.body.total_marks,

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
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    // public getExamQuestions = async (req: any, res: Response) => {
    //     try {
    //         const examId = req.params.id;
    //         const userId = req.user && req.user.id ? String(req.user.id) : "1";
            
    //         const questions = await this.examUtils.getExamQuestions(examId, userId);
    //         for (const question of questions) {
    //             if (question.mcqOptions) {
    //                 const mcqOptions = "[" + question.mcqOptions + "]";
    //                 question.mcqOptions = JSON.parse(mcqOptions);
    //             }
    //         }
            
    //         const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), questions);
    //         return res.status(response.code).json(response);
    //     } catch (err) {
    //         const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
    //         return res.status(response.error.code).json(response);
    //     }
    // }

    public enrollExamUser = async (req: any, res: Response) => {
        try {
            const examId = req.params.id;
            const userId = req.user && req.user.id ? req.user.id : null;
            console.log('user Id :', req.user);
            const enroll = await this.examUtils.userEnrollment(examId, userId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), enroll);
            // console.log(response);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public getExamQuestions = async (req: any, res: Response) => {
        try {
            const examId = req.params.id;
            const userId = req.user && req.user.id ? String(req.user.id) : "1";
            
            const questions = await this.examUtils.getExamQuestions(examId, userId);
            for (const question of questions) {
                if (question.mcqOptions) {
                    const mcqOptions = "[" + question.mcqOptions + "]";
                    question.mcqOptions = JSON.parse(mcqOptions);
                }
            }
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), questions);
            console.log(response);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public submitAnswer = async (req: any, res: Response) => {
        try {
            const examId = req.params.id;
            const questionId = req.params.questionId
            const userId = req.user && req.user.id ? req.user.id : null;
            const mcqId = req.body.mcqId;
            // console.log(userId);
            const answer = await this.examUtils.submitAnswer(examId, questionId, userId, mcqId);
            if (answer && answer.affectedRows) {
                const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"),answer);
                return res.status(response.code).json(response);
            } else {
                const response = ResponseBuilder.genErrorResponse(Constants.FAIL_CODE, req.t("SOMETHING_WENT_WRONG"));
                return res.status(response.error.code).json(response);
            }
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public getExamResult = async (req: any, res: Response) => {
        try {
            const examId = req.params.id;
            const userId = req.user && req.user.id ? req.user.id : null;
            
            const result = await this.examUtils.getResult(examId, userId);
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), result);
            console.log(response);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
}
