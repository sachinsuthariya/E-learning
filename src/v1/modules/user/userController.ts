import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { UserUtils } from "./userUtils";
import { Utils } from "../../../helpers/utils";

export class UserController {
    private userUtils: UserUtils = new UserUtils();

    public createUser = async (req: Request, res: Response) => {
        try {
            const userId = Utils.generateUUID();
            const hashedPassword = bcryptjs.hashSync(req.body.password.toString(), Constants.PASSWORD_HASH);

            const user = {
                id: userId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                password: hashedPassword,
                role: req.body.role,
                status: req.body.status
            };

            await this.userUtils.createUser(user);
            const createdUser = await this.userUtils.getUserById(userId);

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, "User created successfully", createdUser);
            return res.status(response.code).json(response);
        } catch (err) {
            console.error(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
            return res.status(response.error.code).json(response);
        }
    }

    public getUserById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const user = await this.userUtils.getUserById(id);
            
            if (!user) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, "User not found");
                return res.status(response.error.code).json(response);
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, "User retrieved successfully", user);
            return res.status(response.code).json(response);
        } catch (err) {
            console.error(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
            return res.status(response.error.code).json(response);
        }
    }

    public getAllUsers = async (req: Request, res: Response) => {
        try {
            const allUsers = await this.userUtils.getAllUsers();
            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, "All users retrieved successfully", allUsers);
            return res.status(response.code).json(response);
        } catch (err) {
            console.error(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
            return res.status(response.error.code).json(response);
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const deletedUser = await this.userUtils.deleteUser(id);

            if (!deletedUser) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, "User not found");
                return res.status(response.error.code).json(response);
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, "User deleted successfully");
            return res.status(response.code).json(response);
        } catch (err) {
            console.error(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
            return res.status(response.error.code).json(response);
        }
    }

    public restoreUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const restoredUser = await this.userUtils.restoreUser(id);

            if (!restoredUser) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, "User not found");
                return res.status(response.error.code).json(response);
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, "User restored successfully");
            return res.status(response.code).json(response);
        } catch (err) {
            console.error(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
            return res.status(response.error.code).json(response);
        }
    }

    public updateUser = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const userUpdates = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobile: req.body.mobile,
                role: req.body.role,
                status: req.body.status
            };

            const updatedUser = await this.userUtils.updateUser(userId, userUpdates);
            
            if (!updatedUser) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, "User not found");
                return res.status(response.error.code).json(response);
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, "User updated successfully", updatedUser);
            return res.status(response.code).json(response);
        } catch (err) {
            console.error(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
            return res.status(response.error.code).json(response);
        }
    }
    
    public updateUserStatus = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const userUpdates = {
                status : req.body.status
            };

            const updatedUser = await this.userUtils.updateUser(userId, userUpdates);
            
            if (!updatedUser) {
                const response = ResponseBuilder.genErrorResponse(Constants.NOT_FOUND_CODE, "User not found");
                return res.status(response.error.code).json(response);
            }

            const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, "User status updated successfully", updatedUser);
            return res.status(response.code).json(response);
        } catch (err) {
            console.error(err);
            const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, "Internal server error");
            return res.status(response.error.code).json(response);
        }
    };
}
