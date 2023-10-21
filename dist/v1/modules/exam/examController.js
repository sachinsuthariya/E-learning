"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamController = void 0;
const constants_1 = require("../../../config/constants");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const examUtils_1 = require("./examUtils");
const utils_1 = require("../../../helpers/utils");
class ExamController {
    constructor() {
        this.examUtils = new examUtils_1.ExamUtils();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.id = utils_1.Utils.generateUUID();
                yield this.examUtils.create(req.body);
                const exam = yield this.examUtils.getById(req.body.id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const exam = yield this.examUtils.getById(id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.allExams = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const loginUserId = req.user && req.user.id ? req.user.id : null;
                const getAllExams = yield this.examUtils.getAllExams(loginUserId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllExams);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.log(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.enrolledExams = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const loginUserId = req.user && req.user.id ? req.user.id : null;
                // return loginUserId;
                const enrolledExams = yield this.examUtils.userEnrolledExams(loginUserId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), enrolledExams);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.log(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                };
                const updateExam = yield this.examUtils.updateById(examId, examDetails);
                if (!updateExam || !updateExam.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("EXAM_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const exam = yield this.examUtils.getById(examId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
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
        this.enrollExamUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const examId = req.params.id;
                const userId = req.user && req.user.id ? req.user.id : null;
                console.log('user Id :', req.user);
                const enroll = yield this.examUtils.userEnrollment(examId, userId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), enroll);
                // console.log(response);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.log(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.getExamQuestions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const examId = req.params.id;
                const userId = req.user && req.user.id ? String(req.user.id) : "1";
                const questions = yield this.examUtils.getExamQuestions(examId, userId);
                for (const question of questions) {
                    if (question.mcqOptions) {
                        const mcqOptions = "[" + question.mcqOptions + "]";
                        question.mcqOptions = JSON.parse(mcqOptions);
                    }
                }
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), questions);
                console.log(response);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.log(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.submitAnswer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const examId = req.params.id;
                const questionId = req.params.questionId;
                const userId = req.user && req.user.id ? req.user.id : null;
                const mcqId = req.body.mcqId;
                // console.log(userId);
                const answer = yield this.examUtils.submitAnswer(examId, questionId, userId, mcqId);
                if (answer && answer.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), answer);
                    return res.status(response.code).json(response);
                }
                else {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.FAIL_CODE, req.t("SOMETHING_WENT_WRONG"));
                    return res.status(response.error.code).json(response);
                }
            }
            catch (err) {
                console.log(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.getExamResult = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const examId = req.params.id;
                const userId = req.user && req.user.id ? req.user.id : null;
                const result = yield this.examUtils.getResult(examId, userId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), result);
                console.log(response);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.log(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
    }
}
exports.ExamController = ExamController;
//# sourceMappingURL=examController.js.map
