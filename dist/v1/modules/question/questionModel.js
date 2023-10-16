"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class QuestionModel extends model_1.Model {
    constructor(body) {
        super();
        const { question, examId, points, nagativePoints, } = body;
        this.question = question;
        this.examId = examId;
        this.points = points;
        this.nagativePoints = nagativePoints;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], QuestionModel.prototype, "question", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], QuestionModel.prototype, "examId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber()
], QuestionModel.prototype, "points", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber()
], QuestionModel.prototype, "nagativePoints", void 0);
exports.QuestionModel = QuestionModel;
//# sourceMappingURL=questionModel.js.map