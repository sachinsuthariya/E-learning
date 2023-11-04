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
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }

    public update = async (req: any, res: Response) => {
        try {
            const questionId = req.params.id; // Assuming questionId is in the URL parameter
            const questionInfo = {
                examId: req.body.examId,
                question: req.body.question,
                points: req.body.points,
                nagativePoints: req.body.nagativePoints
            };
    
            // Update the question information
            await this.questionUtils.updateById(questionId, questionInfo);
            console.log(req.body);
            const mcqDetails = req.body.mcqOptions.map((mcq) => ({
                id: mcq.id,
                optionText: mcq.optionText,
                isCorrect: mcq.isCorrect
            }));
    
            // Update MCQ options for the question
            await this.questionUtils.updateMCQOptions(mcqDetails,questionId);
    
            const updatedQuestionDetails = await this.questionUtils.getById(questionId);
    
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), updatedQuestionDetails);
            return res.status(response.code).json(response);
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
    public deleteQuestion = async (req: any, res: Response) => {
        try {
            const questionId = req.params.id; // Assuming questionId is in the URL parameter
    
            const success = await this.questionUtils.destroyQuestion(questionId);
    
            if (success) {
                const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("QUESTION_DELETED"));
                return res.status(response.code).json(response);
            } else {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, req.t("QUESTION_NOT_FOUND"));
                return res.status(response.error.code).json(response);
            }
        } catch (err) {
            console.log(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
            return res.status(response.error.code).json(response);
        }
    }
}
