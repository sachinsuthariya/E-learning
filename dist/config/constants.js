"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
}
exports.Constants = Constants;
Constants.TIMEZONE = "Asia/Kolkata";
Constants.SUCCESS = "SUCCESS";
Constants.ERROR = "ERROR";
Constants.BAD_DATA = "BAD_DATA";
Constants.BACKEND_API_FAILURE = "BACKEND_API_FAILURE";
Constants.CODE = "CODE";
Constants.APPROVED = "APPROVED";
Constants.INVALID_REQUEST = "INVALID_REQUEST";
Constants.SOCIAL_TYPE = {
    FACEBOOK: "FACEBOOK",
    GOOGLE: "GOOGLE",
};
Constants.aws = {
    userImage: "user",
};
Constants.PASSWORD_HASH = 12;
Constants.DATE_TIME_FORMAT = "YYYY-MM-DD hh:mm:ss";
Constants.UNAUTHORIZED_CODE = 401;
Constants.NOT_FOUND_CODE = 404;
Constants.SUCCESS_CODE = 200;
Constants.INTERNAL_SERVER_ERROR_CODE = 500;
Constants.FAIL_CODE = 400;
Constants.RANDOM_CODE_STR_LENGTH = 6;
Constants.RECORDS_PER_PAGE = 100000;
Constants.SES_API_VERSION = "2010-12-01";
Constants.SOCIAL_ID = "socialId";
Constants.GOOGLE = "google";
Constants.FACEBOOK = "facebook";
Constants.OTP_CODE_DIGITS = 6;
Constants.AUTH_OTP_EXPIRES = 5; // 5 minutes
Constants.PAGES = {
    limit: 10,
    page: 0,
    staticCount: 20,
};
Constants.UPLOAD_TYPES = { PROFILE_PICTURE: "PROFILE_PICTURE" };
Constants.UPLOAD_SIZES = { PROFILE_PICTURE: 2000000 };
Constants.EMAIL_SUBJECTS = {
    SINGUP: "Welcome to MISSION IAS",
    FORGET_PASSWORD: "Forget Password"
};
//# sourceMappingURL=constants.js.map