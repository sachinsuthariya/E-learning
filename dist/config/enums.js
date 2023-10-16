"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionType = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "Student";
    UserRole["ADMIN"] = "Admin";
    UserRole["PROFESSIOR"] = "Professior";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "Active";
    UserStatus["INACTIVE"] = "Inactive";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var QuestionType;
(function (QuestionType) {
    QuestionType["MCQ"] = "MCQ";
    QuestionType["OPNE"] = "OPEN";
})(QuestionType = exports.QuestionType || (exports.QuestionType = {}));
//# sourceMappingURL=enums.js.map