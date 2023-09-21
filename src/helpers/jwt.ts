import * as jwt from "jsonwebtoken";

export class Jwt {
  /*
  * getAuthToken
  */
  public static getAuthToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET);
  }

  /*
  * decodeAuthToken
  */
  public static decodeAuthToken(token) {
    if (token) {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        // logger.error(error);
        return false;
      }
    }
    return false;
  }
}
