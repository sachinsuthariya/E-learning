import bcryptjs = require("bcryptjs");
import { Request, Response, response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { CourseUtils } from "./courseUtils";
import { Utils } from "../../../helpers/utils";
import { Media } from "../../../helpers/media";
import { FileTypes } from "../../../config/enums";
// import { google, youtube_v3 } from "googleapis";
// import { OAuth2Client } from "google-auth-library";
import axios from 'axios';

export class CourseController {
  private courseUtils: CourseUtils = new CourseUtils();

  private clientId = "0hqmaJlGTVKG3M47T7FlnQ"
  private accountId = "xQTYRngYSmG-tkl4gGxKSw"
  private clientSecret = "8FAia3RDhDRoMVkFH4fXUsa7cM4daUWu"
  private auth_token_url = "https://zoom.us/oauth/token"
  private api_base_url = "https://api.zoom.us/v2"

  // private apiKey = "AIzaSyClfSna-etdQmF5C_fkKTT_FVvMGhy1tRU";

  // private oAuth2Client = new OAuth2Client({
  //   clientId:
  //     "975740311220-tb54qtq92to0sf20u3kfpos4e20k02e7.apps.googleusercontent.com",
  //   clientSecret: "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",
  //   redirectUri: "http://localhost:3000/api/v1/course/startLiveStream",
  // });

  // private youtube = google.youtube({
  //   version: "v3",
  //   auth: this.apiKey,
  // });

  private authTokens: any = null;

  public create = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      console.log(req.body);
      const image = req.files.image;
      if (image) {
        req.body.attachment = Media.uploadImage(image, FileTypes.COURSES);
      }
      console.log(req.body);
      await this.courseUtils.create(req.body);
      const course = await this.courseUtils.getById(req.body.id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        course
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public getById = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const course = await this.courseUtils.getById(id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        course
      );
      // console.log(response);
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public allCourses = async (req: any, res: Response) => {
    try {
      const courses = await this.courseUtils.getAllCourses();
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        courses
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
  public appAllCourses = async (req: any, res: Response) => {
    try {
      const courses = await this.courseUtils.getAllActiveCourses();
      // console.log(courses);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        courses
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
  public delete = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const course = await this.courseUtils.destroy(id);

      if (!course || !course.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.FAIL_CODE,
          req.t("INAVALID_REQUEST")
        );
        return res.status(response.code).json(response);
      }

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_CURRENT_AFFAIR_DELETE")
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

  public restore = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const course = await this.courseUtils.restoreCourse(id);

      if (!course || !course.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.FAIL_CODE,
          req.t("INAVALID_REQUEST")
        );
        return res.status(response.code).json(response);
      }

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_CURRENT_AFFAIR_RESTORE")
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

  public update = async (req: any, res: Response) => {
    try {
      console.log(req.body);
      const courseId = req.params.id;
      const image = req.files.image;
      const courseDetails: any = {
        title: req.body.title,
        description: req.body.description,
        category_id: req.body.category_id,
        isIncludesLiveClass: req.body.isIncludesLiveClass,
        isFree: req.body.isFree,
        materials: req.body.materials,
        price: req.body.price,
        payment_url: req.body.payment_url,
        material_price: req.body.material_price,
        status: req.body.status,
      };

      if (image) {
        courseDetails.attachment = Media.uploadImage(image, FileTypes.COURSES);
        await this.courseUtils.deleteImage(courseId);
      }

      const updateCourse = await this.courseUtils.updateById(
        courseId,
        courseDetails
      );

      if (!updateCourse || !updateCourse.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const course = await this.courseUtils.getById(courseId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        course
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

  public updateStatus = async (req: any, res: Response) => {
    try {
      const courseId = req.params.id;
      const courseDetails = {
        status: req.body.status,
      };

      const updateCourses = await this.courseUtils.updateById(
        courseId,
        courseDetails
      );

      if (!updateCourses || !updateCourses.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const course = await this.courseUtils.getById(courseId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        course
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
  // public authLiveStream = async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   try {
  //     const courseId = req.params.id;
  //     const authUrl = this.oAuth2Client.generateAuthUrl({
  //       access_type: "offline",
  //       scope: ["https://www.googleapis.com/auth/youtube"],
  //     });
  //     // console.log('Authorize this app by visiting this URL:', [authUrl]);
  //     res.json({ success: true, authUrl, courseId });
  //   } catch (error) {
  //     console.error("Error starting live stream:", error.message);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // };
  public createSignature = async (req: any, res: Response)=> {
      try {
        
        const { meetingNumber, role } = req.body;
        console.log(req.body);
        
        const timestamp = new Date().getTime();
        const message = Buffer.from(this.clientId + meetingNumber + timestamp + role).toString('base64');
        const hash = require('crypto').createHmac('sha256', this.clientSecret).update(message).digest('base64');
    
        const signature = Buffer.from(`${this.clientId}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
        console.log(signature);
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS"),
          signature
        );
        return res.status(response.code).json(signature);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  // public createMeeting = async (topic, duration, start_time,req: any, res: Response)=> {
    public createMeeting = async (req: any, res: Response)=> {
      // return;
    try {
      const title = req.body.title;
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id='+this.accountId,
        headers: {
            'Authorization': 'Basic MGhxbWFKbEdUVktHM000N1Q3RmxuUTo4RkFpYTNSRGhEUm9NVmtGSDRmWFVzYTdjTTRkYVVXdQ=='
          }
      };
        let authResponse
        await axios.request(config)
            .then((response) => {
              authResponse = response.data;
            })
            .catch((error) => {
                console.log(error);
            });

        const access_token = authResponse.access_token;
        // console.log(access_token);

        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }

        let data = JSON.stringify({
            "topic": title,
            "type": 2,
            "duration": 40,
            "settings": {
                "join_before_host": true,
                "waiting_room": true
            }
        });
        const meetingResponse = await axios.post(`${this.api_base_url}/users/me/meetings`, data, { headers });

        if (meetingResponse.status !== 201) {
            // return 'Unable to generate meeting link';
        }

        const response_data = meetingResponse.data;
        // console.log(response_data);
        const content = {
            meeting_id: response_data.id,
            meeting_url: response_data.join_url,
            meetingTime: response_data.start_time,
            purpose: response_data.topic,
            duration: response_data.duration,
            message: 'Success',
            status: 1,
        };
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS"),
          response_data
        );
        return res.status(response.code).json(response_data);

    }catch (e) {
      console.error("Error occurred:", e.message);
      console.error("Stack trace:", e.stack);
    }
}

  public enrolledCourses = async (req: any, res: Response) => {
    try {
      const loginUserId = req.user && req.user.id ? req.user.id : null;

      const enrolledCourses = await this.courseUtils.userEnrolledCourses(loginUserId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledCourses
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public enrolledCoursesCheckAdmin = async (req: any, res: Response) => {
    try {
      const userId = req.params.id;
      const enrolledCourses = await this.courseUtils.userEnrolledCourses(userId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledCourses
      );
      // console.log(response);
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public enrollCourseUser = async (req: any, res: Response) => {
    try {
      // console.log(req);
      // return;
      const courseId = req.params.id;
      const studentId = req.body.student_id;
      // console.log("user Id :", req.user);
      const enroll = await this.courseUtils.studentEnrollment(courseId, studentId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enroll
      );
      // console.log(response);
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  }
  public enrolledStudentsCheckAdmin = async (req: any, res: Response) => {
    // console.log(req.pa)
    try {
      const courseId = req.params.id;
      // return loginUserId;
      const enrolledStudents = await this.courseUtils.courseEnrolledStudents(courseId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledStudents
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
}
