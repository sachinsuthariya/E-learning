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
exports.ExamUtils = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const sqlUtils_1 = require("../../../helpers/sqlUtils");
const utils_1 = require("../../../helpers/utils");
class ExamUtils {
    constructor() {
        this.sqlUtils = new sqlUtils_1.SqlUtils();
        // Create Courses
        this.create = (examDetails) => My.insert(tables_1.Tables.EXAM, examDetails);
        this.getById = (examId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.first(tables_1.Tables.EXAM, [
                "id",
                "title",
                "description",
                "exam_date",
                "duration_minutes",
                "start_time",
                "end_time",
                "total_marks",
                "user_id",
                "created_at",
                "updated_at",
            ], "id=?", [examId]);
        });
        // public getAllExams = async () => {
        //   const getAllExams = await My.findAll(Tables.EXAM, [
        //     "id", "title", "duration_minutes", "start_time", "end_time", "pass_marks", "created_at", "updated_at"
        //   ]);
        //   return getAllExams;
        // };
        this.getAllExams = (loginUserId) => __awaiter(this, void 0, void 0, function* () {
            const getAllExams = yield My.findAll(tables_1.Tables.EXAM, [
                "id", "description", "title", "duration_minutes", "start_time", "end_time", "user_id", "total_marks", "created_at", "updated_at", "exam_date"
            ]);
            const currentDate = new Date(); // Get the current date
            const pastExams = [];
            const presentExams = [];
            const futureExams = [];
            const noDateAvailableExams = [];
            getAllExams.forEach((exam) => {
                const examDate = new Date(exam.exam_date);
                const startTime = new Date(exam.start_time);
                // Extract only the date portion for comparison
                const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                const examDateOnly = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
                const startTimeOnly = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
                if (examDate.toString() === "Invalid Date") {
                    noDateAvailableExams.push(exam);
                }
                else if (startTimeOnly < currentDateOnly) {
                    pastExams.push(exam);
                }
                else if (startTimeOnly > currentDateOnly) {
                    futureExams.push(exam);
                }
                else {
                    presentExams.push(exam);
                }
                // Check if the loginUserId is enrolled in the exam
                try {
                    const userIdArray = JSON.parse(exam.user_id);
                    console.log("userIdArray =>", userIdArray);
                    console.log("loginUserId =>", loginUserId, "cond =", userIdArray.includes(loginUserId));
                    exam.isEnrolledUser = userIdArray.includes(loginUserId) ? true : false;
                    console.log("exam.isEnrolledUser ==>", exam.isEnrolledUser);
                }
                catch (error) {
                    exam.isEnrolledUser = false;
                }
                // Remove the "user_id" field from the exam response
                delete exam.user_id;
            });
            return {
                pastExams,
                presentExams,
                futureExams,
                noDateAvailableExams,
            };
        });
        this.updateById = (examId, examDetails) => __awaiter(this, void 0, void 0, function* () {
            const updatedExam = yield My.update(tables_1.Tables.EXAM, examDetails, "id=?", [
                examId,
            ]);
            return updatedExam;
        });
        this.userEnrollment = (examId, userId) => __awaiter(this, void 0, void 0, function* () {
            const exam = yield this.getById(examId);
            if (!exam || !exam.user_id) {
                // If user_id is not defined or is not an array, initialize it as an array with the current user's ID
                const updatedExam = yield My.update(tables_1.Tables.EXAM, { user_id: JSON.stringify([userId]) }, "id=?", [examId]);
            }
            else {
                // Parse the existing user_ids as an array
                const existingUserIds = JSON.parse(exam.user_id);
                // console.log(existingUserIds);
                // Check if the current user's ID is not already in the array
                if (!existingUserIds.includes(userId)) {
                    existingUserIds.push(userId);
                    // Update the user_id column with the modified array
                    const updatedExam = yield My.update(tables_1.Tables.EXAM, { user_id: JSON.stringify(existingUserIds) }, "id=?", [examId]);
                }
            }
            return exam;
        });
        this.getExamQuestions = (examId, userId) => __awaiter(this, void 0, void 0, function* () {
            const model = `${tables_1.Tables.QUESTION} AS q
      INNER JOIN ${tables_1.Tables.EXAM} AS e ON e.id = q.examId
      INNER JOIN ${tables_1.Tables.MCQ_OPTION} AS mcq ON q.id = mcq.questionId
      LEFT JOIN ${tables_1.Tables.STUDENT_EXAM_SUBMISSION} AS sub ON sub.questionId = q.id AND sub.userId = '${userId}'`;
            const condition = `q.examId = '${examId}'`;
            const fields = `q.id as id, q.question, q.questionType, q.points, q.nagativePoints, q.examId, e.duration_minutes AS duration, sub.mcqId as selectedMCQ,
      GROUP_CONCAT(
        JSON_OBJECT(
            'id', mcq.id,
            'optionText', mcq.optionText
        )
        ORDER BY mcq.id
    ) AS mcqOptions`;
            const group = `q.id, q.question, q.questionType, q.points, q.nagativePoints, sub.id`;
            const query = `SELECT ${fields} FROM ${model} WHERE ${condition} GROUP BY ${group}`;
            return yield My.query(query);
        });
        this.submitAnswer = (examId, questionId, userId, mcqId) => __awaiter(this, void 0, void 0, function* () {
            const where = `examId = ? AND questionId = ? AND userId = ?`;
            const whereParams = [examId, questionId, userId];
            const submission = yield My.first(tables_1.Tables.STUDENT_EXAM_SUBMISSION, ["id", "examId", "questionId", "mcqId", "userId"], where, whereParams);
            let submittedAnswer;
            if (submission && submission.id) {
                // Handle update logic for existing submission
                const payload = {
                    mcqId
                };
                submittedAnswer = yield My.updateFirst(tables_1.Tables.STUDENT_EXAM_SUBMISSION, payload, where, whereParams);
                yield this.updateExamResultOnUpdateSubmission(examId, userId, questionId, mcqId, submission);
            }
            else {
                // Handle insert logic for new submission
                const payload = {
                    id: utils_1.Utils.generateUUID(),
                    mcqId,
                    questionId,
                    examId,
                    userId
                };
                submittedAnswer = yield My.insert(tables_1.Tables.STUDENT_EXAM_SUBMISSION, payload);
                yield this.updateExamResultOnNewSubmission(examId, userId, questionId, mcqId);
            }
            // After submitting the answer, check if the MCQ is correct and adjust the score
            return submittedAnswer;
        });
        this.getResult = (examId, userId) => __awaiter(this, void 0, void 0, function* () {
            return yield My.first(tables_1.Tables.EXAM_RESULT, ["id", "score"], "examId=? AND userId=?", [examId, userId]);
        });
        this.userEnrolledExams = (loginUserId) => __awaiter(this, void 0, void 0, function* () {
            const getAllExams = yield My.findAll(tables_1.Tables.EXAM, [
                "id", "description", "title", "duration_minutes", "start_time", "end_time", "user_id", "total_marks", "created_at", "updated_at", "exam_date"
            ]);
            // return getAllExams;
            const userExams = [];
            getAllExams.forEach((exam) => {
                try {
                    const userIdArray = JSON.parse(exam.user_id);
                    if (Array.isArray(userIdArray)) {
                        if (userIdArray.includes(loginUserId)) {
                            // Include the exam in the result only if loginUserId is enrolled
                            userExams.push(exam);
                        }
                    }
                    else {
                        console.log(`Invalid user_id format for exam ${exam.id}`);
                    }
                }
                catch (error) {
                    // Handle JSON parsing error, e.g., if the "user_id" is not a valid JSON array
                    console.error(`Error parsing user_id for exam ${exam.id}:`, error);
                }
            });
            return userExams;
        });
    }
    updateExamResultOnNewSubmission(examId, userId, questionId, mcqId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = `examId = ? AND userId = ?`;
            const whereParams = [examId, userId];
            // Retrieve points for the question and check if it's correct
            const question = yield My.first(tables_1.Tables.QUESTION, ["points"], `id = ?`, [questionId]);
            const mcqOption = yield My.first(tables_1.Tables.MCQ_OPTION, ["isCorrect"], `id = ?`, [mcqId]);
            if (!question || !question.points) {
                return null;
            }
            const points = question.points;
            // Check if an entry exists in EXAM_RESULTS
            const existingResult = yield My.first(tables_1.Tables.EXAM_RESULT, ["score"], where, whereParams);
            if (existingResult) {
                // Check if the same combination of mcqId and userId already exists in STUDENT_EXAM_SUBMISSION
                const submissionWhere = `examId = ? AND questionId = ? AND userId = ? AND mcqId = ?`;
                const submissionWhereParams = [examId, questionId, userId, mcqId];
                const existingSubmission = yield My.first(tables_1.Tables.STUDENT_EXAM_SUBMISSION, ["id"], submissionWhere, submissionWhereParams);
                if (!mcqOption || mcqOption.isCorrect !== 0 || !existingSubmission || !existingSubmission.id) {
                    yield My.updateFirst(tables_1.Tables.EXAM_RESULT, { score: existingResult.score + points }, where, whereParams);
                }
            }
            else {
                if (!mcqOption || mcqOption.isCorrect !== 1) {
                    yield My.insert(tables_1.Tables.EXAM_RESULT, {
                        id: utils_1.Utils.generateUUID(),
                        examId,
                        userId,
                        score: 0.00,
                    });
                    return "wrong";
                }
                else {
                    yield My.insert(tables_1.Tables.EXAM_RESULT, {
                        id: utils_1.Utils.generateUUID(),
                        examId,
                        userId,
                        score: points,
                    });
                    return "new with points";
                }
            }
        });
    }
    updateExamResultOnUpdateSubmission(examId, userId, questionId, mcqId, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = `examId = ? AND userId = ?`;
            const whereParams = [examId, userId];
            // Retrieve points for the question and check if it's correct
            const question = yield My.first(tables_1.Tables.QUESTION, ["points"], `id = ?`, [questionId]);
            const mcqOption = yield My.first(tables_1.Tables.MCQ_OPTION, ["isCorrect"], `id = ?`, [mcqId]);
            const submittedMcqOption = yield My.first(tables_1.Tables.MCQ_OPTION, ["isCorrect"], `id = ?`, [submission.mcqId]);
            if (!question || !question.points) {
                return null;
            }
            const points = question.points;
            // Check if an entry exists in EXAM_RESULTS
            const existingResult = yield My.first(tables_1.Tables.EXAM_RESULT, ["score"], where, whereParams);
            if (existingResult) {
                // Check if the same combination of mcqId and userId already exists in STUDENT_EXAM_SUBMISSION
                const submissionWhere = `examId = ? AND questionId = ? AND userId = ? AND mcqId = ?`;
                const submissionWhereParams = [examId, questionId, userId, mcqId];
                const existingSubmission = yield My.first(tables_1.Tables.STUDENT_EXAM_SUBMISSION, ["id"], submissionWhere, submissionWhereParams);
                if (existingSubmission || existingSubmission.id) {
                    if (!mcqOption || mcqOption.isCorrect !== 0 && submission.mcqId !== mcqId) {
                        if (!submittedMcqOption || submittedMcqOption.isCorrect !== 1) {
                            yield My.updateFirst(tables_1.Tables.EXAM_RESULT, { score: existingResult.score + points }, where, whereParams);
                        }
                    }
                    else if (!mcqOption || mcqOption.isCorrect !== 1 && submission.mcqId !== mcqId) {
                        if (!submittedMcqOption || submittedMcqOption.isCorrect !== 0) {
                            yield My.updateFirst(tables_1.Tables.EXAM_RESULT, { score: existingResult.score - points }, where, whereParams);
                        }
                    }
                }
            }
            else {
                if (!mcqOption || mcqOption.isCorrect !== 1) {
                    yield My.insert(tables_1.Tables.EXAM_RESULT, {
                        id: utils_1.Utils.generateUUID(),
                        examId,
                        userId,
                        score: 0.00,
                    });
                    return "wrong";
                }
                else {
                    yield My.insert(tables_1.Tables.EXAM_RESULT, {
                        id: utils_1.Utils.generateUUID(),
                        examId,
                        userId,
                        score: points,
                    });
                }
            }
        });
    }
}
exports.ExamUtils = ExamUtils;
//# sourceMappingURL=examUtils.js.map