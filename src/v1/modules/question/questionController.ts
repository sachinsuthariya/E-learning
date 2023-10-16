import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { QuestionUtils } from "./questionUtils";
import { Utils } from "../../../helpers/utils";

export class QuestionController {
    private questionUtils: QuestionUtils = new QuestionUtils();

    public create = async (req: any, res: Response) => {
        try {
            const questionId = Utils.generateUUID();
            const qeuestionInfo = {
                id: questionId,
                examId: req.body.examId,
                question: req.body.question,
                points: req.body.points,
                nagativePoints: req.body.nagativePoints
            }
            const mcqDetails = []
            for (const mcq of req.body.mcqOptions) {
                mcqDetails.push({ 
                    id: Utils.generateUUID(), 
                    questionId: questionId, 
                    optionText: mcq.optionText, 
                    isCorrect: mcq.isCorrect 
                })
            }
            await this.questionUtils.create(qeuestionInfo);
            await this.questionUtils.addQuestionOptions(mcqDetails)

            const questionDetails = await this.questionUtils.getById(req.body.id)
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), questionDetails);
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
            const questionDetails = await this.questionUtils.getById(id);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), questionDetails);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public allQuestions = async (req: any, res: Response) => {
        try {
            const getAllQuestions = await this.questionUtils.getAllQuestions();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllQuestions);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public update = async (req: any, res: Response) => {
        try {
            const questionId = req.params.id;
            const questionDetails = {
                question: req.body.title,
                questionType: req.body.examDate,
                points: req.body.durationMinutes,
                nagativePoints: req.body.startTime,
            }

            const updateExam = await this.questionUtils.updateById(questionId, questionDetails);
            
            if (!updateExam || !updateExam.affectedRows) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("EXAM_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }

            const exam = await this.questionUtils.getById(questionId);
            
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
            return res.status(response.code).json(response);
        } catch (err) {
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
}
