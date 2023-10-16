"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class ExamModel extends model_1.Model {
    constructor(body) {
        super();
        const { title, description, exam_date, duration_minutes, start_time, end_time, total_marks } = body;
        this.title = title;
        this.description = description;
        this.exam_date = exam_date;
        this.duration_minutes = duration_minutes;
        this.start_time = start_time;
        this.end_time = end_time;
        this.total_marks = total_marks;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], ExamModel.prototype, "title", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], ExamModel.prototype, "description", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ExamModel.prototype, "exam_date", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber()
], ExamModel.prototype, "duration_minutes", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ExamModel.prototype, "start_time", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ExamModel.prototype, "end_time", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber()
], ExamModel.prototype, "total_marks", void 0);
exports.ExamModel = ExamModel;
//# sourceMappingURL=examModel.js.map