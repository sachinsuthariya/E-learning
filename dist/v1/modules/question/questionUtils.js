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
exports.QuestionUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const sqlUtils_1 = require("../../../helpers/sqlUtils");
class QuestionUtils {
    constructor() {
        this.sqlUtils = new sqlUtils_1.SqlUtils();
        /**
         * Add exam question
         * @param questionDetails
         * @returns
         */
        this.create = (questionDetails) => My.insert(tables_1.Tables.QUESTION, questionDetails);
        this.addQuestionOptions = (mcqOptionsDetails) => My.insertMany(tables_1.Tables.MCQ_OPTION, mcqOptionsDetails);
        /**
         * Get question details
         * @param questionId string
         * @returns Promise<any>
         */
        this.getById = (questionId) => __awaiter(this, void 0, void 0, function* () {
            const model = `${tables_1.Tables.QUESTION} as q
      INNER JOIN ${tables_1.Tables.EXAM} as e ON q.examId = e.id`;
            const field = [
                "q.id",
                "q.question",
                "q.questionType",
                "q.points",
                "q.nagativePoints",
                "e.id AS examId",
                "e.title as examTitle",
            ];
            const question = yield My.first(model, field, "q.id = ?", [questionId]);
            const mcqOptions = yield My.findAll(tables_1.Tables.MCQ_OPTION, ["id", "questionId", "optionText", "isCorrect"], "questionId = ?", [questionId]);
            return Object.assign(Object.assign({}, question), { mcqOptions });
        });
        this.getAllQuestions = () => __awaiter(this, void 0, void 0, function* () {
            const questionsWithExamNames = yield My.findAll(tables_1.Tables.QUESTION, [
                "id",
                "examId",
                "question",
                "questionType",
                "points",
                "nagativePoints",
            ]);
            // Now, let's fetch the related exam names for each question
            for (const question of questionsWithExamNames) {
                const exam = yield My.first(tables_1.Tables.EXAM, ["title"], "id = ?", [question.examId]);
                question.examName = exam ? exam.title : null;
            }
            return questionsWithExamNames;
        });
        /**
         * Update question
         * @param questionId
         * @param questionDetails
         * @returns
         */
        this.updateById = (questionId, questionDetails) => __awaiter(this, void 0, void 0, function* () { return yield My.update(tables_1.Tables.QUESTION, questionDetails, "id=?", [questionId]); });
    }
}
exports.QuestionUtils = QuestionUtils;
//# sourceMappingURL=questionUtils.js.map