"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = void 0;
class ResponseBuilder {
    static genErrorResponse(code, errMsg) {
        const response = {
            error: {
                code,
                message: errMsg,
            },
        };
        return response;
    }
    static genSuccessResponse(code, message, data = null) {
        const response = {
            status: true,
            code,
            data,
            message,
        };
        return response;
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=responseBuilder.js.map