import { Request, Response } from "express";
import * as _ from "lodash";
import { Constants } from "./config/constants";
import { Jwt } from "./helpers/jwt";
import { ResponseBuilder } from "./helpers/responseBuilder";
import { AuthUtils } from "./v1/modules/auth/authUtils";
import { UserRole, UserStatus } from "./config/enums";

export class Middleware {
  private authUtils: AuthUtils = new AuthUtils();

  public isAuthenticatedAdmin = async (req: any, res: Response, next: () => void) => {
    try {
      const token = req.headers["x-auth-token"] || req.headers["authentication"] || req.headers["authorization"];
      if (!token) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      const userData = Jwt.decodeAuthToken(token);
      if (!userData.id) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      req.user = await this.authUtils.getUserById(userData.id);
      console.log(req.user);
      console.log("condition =>", req.user.id == userData.id && req.user.role == UserRole.ADMIN && req.user.email == userData.email);
      
      if (req.user.id == userData.id && req.user.role === UserRole.ADMIN && req.user.email == userData.email) {
        next();
      } else {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
    }
  }

  public isAuthenticatedProfessor = async (req: any, res: Response, next: () => void) => {
    try {
      const token = req.headers["x-auth-token"] || req.headers["authentication"] || req.headers["authorization"];
      if (!token) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      const userData = Jwt.decodeAuthToken(token);
      if (!userData.id) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      req.user = await this.authUtils.getUserById(userData.id);
      if (req.user.id == userData.id && req.user.role == UserRole.PROFESSOR && req.user.email == userData.email && req.user.mobile && userData.mobile ) {
        next();
      } else {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
    }
  }

  public isAuthenticated = async (req: any, res: Response, next: () => void) => {
    try {
      const token = req.headers["x-auth-token"] || req.headers["authentication"] || req.headers["authorization"];
      if (!token) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      const userData = Jwt.decodeAuthToken(token);
      if (!userData.id) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      req.user = await this.authUtils.getUserById(userData.id);
      if (req.user.id == userData.id && [UserRole.ADMIN, UserRole.PROFESSOR].includes(req.user.role) && req.user.email == userData.email && req.user.mobile && userData.mobile ) {
        next();
      } else {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
    }
  }

  public isAuthenticatedUser = async (req: any, res: Response, next: () => void) => {
    try {
      const token = req.headers["x-auth-token"] || req.headers["authentication"] || req.headers["authorization"];
      if (!token) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      const userData = Jwt.decodeAuthToken(token);
      if (!userData.id) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      req.user = await this.authUtils.getUserById(userData.id);
      if (req.user.id == userData.id && [UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT].includes(req.user.role) && req.user.email == userData.email && req.user.mobile && userData.mobile ) {
        next();
      } else {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
    }
  }

  public isAuthenticatedStudent = async (req: any, res: Response, next: () => void) => {
    try {
      const token = req.headers["x-auth-token"] || req.headers["authentication"] || req.headers["authorization"];
      console.log(req.headers);
      if (!token) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      const userData = Jwt.decodeAuthToken(token);
      if (!userData.id) {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
      req.user = await this.authUtils.getUserById(userData.id);
      if (req.user.id == userData.id && req.user.role == UserRole.STUDENT && req.user.email == userData.email && req.user.mobile == userData.mobile) {
        next();
      } else {
        const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("UNAUTHORIZED"));
        return res.status(response.error.code).json(response);
      }
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
    }
  }

  public isUserActive = async (req: any, res: Response, next: () => void) => {
    const userId = req.user.id; 
    const userData = await this.authUtils.getUserById(userId);
    if (userData.status == UserStatus.ACTIVE) {
      next();
    }
    const response = ResponseBuilder.genErrorResponse(Constants.UNAUTHORIZED_CODE, req.t("ERR_ACCOUNT_NOT_ACTIVE"));
    return res.status(response.error.code).json(response);
  }
}
