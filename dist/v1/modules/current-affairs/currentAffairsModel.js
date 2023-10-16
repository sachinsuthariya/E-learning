"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentAffairsModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class CurrentAffairsModel extends model_1.Model {
    constructor(body) {
        super();
        const { title, content } = body;
        this.title = title;
        this.content = content;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], CurrentAffairsModel.prototype, "title", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], CurrentAffairsModel.prototype, "content", void 0);
exports.CurrentAffairsModel = CurrentAffairsModel;
//# sourceMappingURL=currentAffairsModel.js.map