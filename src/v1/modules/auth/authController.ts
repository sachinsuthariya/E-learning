import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { AuthUtils } from "./authUtils";
import { Utils } from "../../../helpers/utils";
import { UserRole } from "../../../config/enums";
import { SendEmail } from "../../../helpers/sendEmail";

export class AuthController {
  private authUtils: AuthUtils = new AuthUtils();

  public signup = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      req.body.role = UserRole.STUDENT;
      // encrypt password
      req.body.password = bcryptjs.hashSync(
        req.body.password.toString(),
        Constants.PASSWORD_HASH
      );

      const result = await this.authUtils.createUser(req.body);
      // JWT token
      const payload = {
        id: req.body.id,
        email: req.body.email,
        mobile: req.body.mobile,
        role: req.body.role,
      };

      const token = Jwt.getAuthToken(payload);

      const emailData = {
        "{USERNAME}": req.body.firstName || "" + req.body.lastName || "",
        "{{LINK}}": `${process.env.FE_DOMAIN}/${token}`,
      };
      await SendEmail.sendRawMail(
        "signup",
        emailData,
        [req.body.email],
        Constants.EMAIL_SUBJECTS.SINGUP
      );

      const userDetails = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        role: req.body.role,
        token,
      };
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        userDetails
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  // Admin login
  public login = async (req: any, res: Response) => {
    try {
      const payload = {
        id: req.body._authentication.id,
        email: req.body._authentication.email,
        mobile: req.body._authentication.mobile,
        role: req.body._authentication.role,
      };
      const token = Jwt.getAuthToken(payload);

      const data = {
        firstName: req.body._authentication.firstName,
        lastName: req.body._authentication.lastName,
        mobile: req.body._authentication.mobile,
        email: req.body._authentication.email,
        role: req.body._authentication.role,
        token,
      };
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_LOGIN"),
        data
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  // forgot password
  public forgotPassword = async (req: any, res: Response) => {
    try {
      const email = req.body.email;
      const user = await this.authUtils.getUserByEmail(email);
      if (user) {
        // JWT token
        const payload = {
          id: user.id,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        };

        const token = Jwt.getAuthToken(payload);

        const emailData = {
          "{USERNAME}": user.firstName || "" + user.lastName || "",
          "{{LINK}}": `${process.env.FE_DOMAIN}/${token}`,
        };
        await SendEmail.sendRawMail(
          "forget-password",
          emailData,
          [req.body.email],
          Constants.EMAIL_SUBJECTS.FORGET_PASSWORD
        );

        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("FORGET_PASSWORD_EMAIL_SENT")
        );
        return res.status(response.code).json(response);
      }
      const response = ResponseBuilder.genErrorResponse(
        Constants.FAIL_CODE,
        req.t("USER_WITH_EMAIL_NOT_EXIST")
      );
      return res.status(response.error.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  // reset password
  public resetPassword = async (req: any, res: Response) => {
    try {
      const token = req.body.token;
      const password = req.body.password;

      const tokenInfo = Jwt.decodeAuthToken(token);

      if (tokenInfo && tokenInfo.id) {
        const user = await this.authUtils.getUserById(tokenInfo.id);
        if (
          user.id == tokenInfo.id &&
          user.email == tokenInfo.email &&
          user.role == tokenInfo.role
        ) {
          const data = {
            password: bcryptjs.hashSync(
              password.toString(),
              Constants.PASSWORD_HASH
            ),
          };
          const result = await this.authUtils.updateUserDetails(data, user.id);
          if (result.affectedRows) {
            const response = ResponseBuilder.genSuccessResponse(
              Constants.SUCCESS_CODE,
              req.t("SUCCESS_CHANGE_PASSWORD")
            );
            return res.status(response.code).json(response);
          }
        }
      }
      const response = ResponseBuilder.genErrorResponse(
        Constants.FAIL_CODE,
        req.t("SOMETHING_WENT_WRONG")
      );
      return res.status(response.error.code).json(response);
    } catch (err) {        
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public verifyAccount = async (req: any, res: Response) => {
    try {
      const token = req.params.token;
      const tokenInfo = Jwt.decodeAuthToken(token);

      if (tokenInfo && tokenInfo.id) {
        const user = await this.authUtils.getUserById(tokenInfo.id);
        if (
          user.id == tokenInfo.id &&
          user.email == tokenInfo.email &&
          user.role == tokenInfo.role
        ) {
          const result = await this.authUtils.updateUserDetails(
            { emailVerified: 1 },
            user.id
          );
          if (result.affectedRows) {
            const response = ResponseBuilder.genSuccessResponse(
              Constants.SUCCESS_CODE,
              req.t("SUCCESS_EMAIL_VERIFICATION")
            );
            return res.status(response.code).json(response);
          }
        }
      }

      const response = ResponseBuilder.genErrorResponse(
        Constants.FAIL_CODE,
        req.t("SOMETHING_WENT_WRONG")
      );
      return res.status(response.error.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  // profile
  // get profile
  public getProfile = async (req: any, res: Response) => {
    try {
      delete req.user.password;
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        req.user
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  // update profile
  public updateProfile = async (req: any, res: Response) => {
    try {
      await this.authUtils.updateUserDetails(req.body, req.user.id);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_UPDATE_PROFILE")
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  // change password
  public changePassword = async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      const userData = await this.authUtils.getUserById(userId);
      const passCheck = await bcryptjs.compare(oldPassword, userData.password);
      if (passCheck) {
        const data = {
          password: bcryptjs.hashSync(
            newPassword.toString(),
            Constants.PASSWORD_HASH
          ),
        };
        await this.authUtils.updateUserDetails(data, userId);
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS_CHANGE_PASSWORD")
        );
        return res.status(response.code).json(response);
      }
      const response = ResponseBuilder.genErrorResponse(
        Constants.FAIL_CODE,
        req.t("ERR_INVALID_PASSWORD")
      );
      return res.status(response.error.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
}
