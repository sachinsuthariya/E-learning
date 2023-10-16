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
exports.QuestionController = void 0;
const constants_1 = require("../../../config/constants");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const questionUtils_1 = require("./questionUtils");
const utils_1 = require("../../../helpers/utils");
class QuestionController {
    constructor() {
        this.questionUtils = new questionUtils_1.QuestionUtils();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = utils_1.Utils.generateUUID();
                const qeuestionInfo = {
                    id: questionId,
                    examId: req.body.examId,
                    question: req.body.question,
                    points: req.body.points,
                    nagativePoints: req.body.nagativePoints
                };
                const mcqDetails = [];
                for (const mcq of req.body.mcqOptions) {
                    mcqDetails.push({
                        id: utils_1.Utils.generateUUID(),
                        questionId: questionId,
                        optionText: mcq.optionText,
                        isCorrect: mcq.isCorrect
                    });
                }
                yield this.questionUtils.create(qeuestionInfo);
                yield this.questionUtils.addQuestionOptions(mcqDetails);
                const questionDetails = yield this.questionUtils.getById(req.body.id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), questionDetails);
                return res.status(response.code).json(response);
            }
            catch (err) {
                console.log(err);
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const questionDetails = yield this.questionUtils.getById(id);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), questionDetails);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.allQuestions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllQuestions = yield this.questionUtils.getAllQuestions();
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), getAllQuestions);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.params.id;
                const questionDetails = {
                    question: req.body.title,
                    questionType: req.body.examDate,
                    points: req.body.durationMinutes,
                    nagativePoints: req.body.startTime,
                };
                const updateExam = yield this.questionUtils.updateById(questionId, questionDetails);
                if (!updateExam || !updateExam.affectedRows) {
                    const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.NOT_FOUND_CODE, req.t("EXAM_NOT_FOUND"));
                    return res.status(response.error.code).json(response);
                }
                const exam = yield this.questionUtils.getById(questionId);
                const response = responseBuilder_1.ResponseBuilder.genSuccessResponse(constants_1.Constants.SUCCESS_CODE, req.t("SUCCESS"), exam);
                return res.status(response.code).json(response);
            }
            catch (err) {
                const response = responseBuilder_1.ResponseBuilder.genErrorResponse(constants_1.Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
                return res.status(response.error.code).json(response);
            }
        });
    }
}
exports.QuestionController = QuestionController;
//# sourceMappingURL=questionController.js.map