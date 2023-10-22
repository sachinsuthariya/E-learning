export class Constants {
  public static readonly TIMEZONE = "Asia/Kolkata";
  public static readonly SUCCESS = "SUCCESS";
  public static readonly ERROR = "ERROR";
  public static readonly BAD_DATA = "BAD_DATA";
  public static readonly BACKEND_API_FAILURE = "BACKEND_API_FAILURE";
  public static readonly CODE = "CODE";
  public static readonly APPROVED = "APPROVED";
  public static readonly INVALID_REQUEST = "INVALID_REQUEST";
  public static readonly SOCIAL_TYPE = {
    FACEBOOK: "FACEBOOK",
    GOOGLE: "GOOGLE",
  };
  public static readonly aws = {
    userImage: "user",
  };

  public static readonly PASSWORD_HASH = 12;
  public static readonly DATE_TIME_FORMAT = "YYYY-MM-DD hh:mm:ss";

  public static readonly UNAUTHORIZED_CODE = 401;
  public static readonly NOT_FOUND_CODE = 404;
  public static readonly SUCCESS_CODE = 200;
  public static readonly INTERNAL_SERVER_ERROR_CODE = 500;
  public static readonly FAIL_CODE = 400;
  public static readonly RANDOM_CODE_STR_LENGTH = 6;
  public static readonly RECORDS_PER_PAGE = 100000;
  public static readonly SES_API_VERSION = "2010-12-01";
  public static readonly SOCIAL_ID = "socialId";
  public static readonly GOOGLE = "google";
  public static readonly FACEBOOK = "facebook";
  public static readonly OTP_CODE_DIGITS = 6;
  public static readonly AUTH_OTP_EXPIRES = 5; // 5 minutes

  public static readonly PAGES = {
    limit: 10,
    page: 0,
    staticCount: 20,
  };
  public static readonly UPLOAD_TYPES = { PROFILE_PICTURE: "PROFILE_PICTURE" };
  public static readonly UPLOAD_SIZES = { PROFILE_PICTURE: 2000000 };

  public static readonly EMAIL_SUBJECTS = {
    SINGUP: "Welcome to MISSION IAS",
    FORGET_PASSWORD: "Forget Password",
  };

  public static readonly DEFAULT_IMAGE = {
    url: `http://localhost:3000/assets/images/default.jpg`,
    thumbnail: `http://localhost:3000/assets/images/default.jpg`,
  };

  public static readonly IMAGE_PATH = "/images/";
  public static readonly IMAGE_THUMBNAIL_PATH = "/images/thumbnails/";
  public static readonly DOCUMENT_PATH = "/document/";
}
