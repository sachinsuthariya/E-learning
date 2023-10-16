"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCategoriesModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class CourseCategoriesModel extends model_1.Model {
    constructor(body) {
        super();
        const { title } = body;
        this.title = title;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], CourseCategoriesModel.prototype, "title", void 0);
exports.CourseCategoriesModel = CourseCategoriesModel;
//# sourceMappingURL=courseCategoriesModel.js.map