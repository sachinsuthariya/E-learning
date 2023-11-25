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
import { google, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export class CourseController {
  private courseUtils: CourseUtils = new CourseUtils();

  private apiKey = "AIzaSyClfSna-etdQmF5C_fkKTT_FVvMGhy1tRU";

  private oAuth2Client = new OAuth2Client({
    clientId:
      "975740311220-tb54qtq92to0sf20u3kfpos4e20k02e7.apps.googleusercontent.com",
    clientSecret: "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",
    redirectUri: "http://localhost:3000/api/v1/course/startLiveStream",
  });

  private youtube = google.youtube({
    version: "v3",
    auth: this.apiKey,
  });

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
  public authLiveStream = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const courseId = req.params.id;
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube"],
      });
      // console.log('Authorize this app by visiting this URL:', [authUrl]);
      res.json({ success: true, authUrl, courseId });
    } catch (error) {
      console.error("Error starting live stream:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public startLiveStream = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const code = req.query.code as string;
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);
      this.authTokens = tokens;
      // console.log('YouTube API Client Credentials:', this.oAuth2Client.credentials);
      // console.log(this.authTokens);
      // return;
      const courseId = "1d557557-e890-4444-ac6b-20a983567aa9";

      const broadcastId = await this.createLiveBroadcast(courseId);
      const streamId = await this.createLiveStream(courseId);
      await this.bindBroadcastToStream(broadcastId, streamId);
      await this.startLiveVideo(broadcastId);

      res.json({ success: true, broadcastId, streamId });
    } catch (error) {
      console.error("Error starting live stream:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  private async createLiveBroadcast(courseId: string): Promise<string> {
    try {
      this.oAuth2Client.setCredentials(this.authTokens);

      // Format the scheduled start time to ISO 8601 format
      const scheduledStartTime = new Date();
      scheduledStartTime.setMinutes(scheduledStartTime.getMinutes() + 10);
      const formattedStartTime = scheduledStartTime.toISOString();

      // Get the YouTube API client with OAuth tokens
      const youtubeWithAuth = google.youtube({
        version: "v3",
        auth: this.oAuth2Client as any,
      });

      // Make the API request to create a live broadcast
      const response = await youtubeWithAuth.liveBroadcasts.insert({
        part: ["snippet,status"],
        requestBody: {
          snippet: {
            title: `Live Stream for Course ${courseId}`,
            description: "Description of the live stream",
            scheduledStartTime: formattedStartTime,
          },
          status: {
            privacyStatus: "public",
          },
        },
      });

      return response.data.id;
    } catch (error) {
      console.error("Error creating live broadcast:", error.message);
      throw error;
    }
  }

  private async createLiveStream(courseId: string): Promise<string> {
    try {
      this.oAuth2Client.setCredentials(this.authTokens);

      // Get the YouTube API client with OAuth tokens
      const youtubeWithAuth = google.youtube({
        version: "v3",
        auth: this.oAuth2Client as any,
      });

      // Make the API request to create a live stream
      const response = await youtubeWithAuth.liveStreams.insert({
        part: ["snippet,cdn"],
        requestBody: {
          snippet: {
            title: `Live Stream for Course ${courseId}`,
            description: "Description of the live stream",
          },
          cdn: {
            frameRate: "30fps",
            ingestionType: "rtmp",
            resolution: "720p",
          },
        },
      });

      return response.data.id;
    } catch (error) {
      console.error("Error creating live stream:", error.message);
      throw error;
    }
  }

  private async bindBroadcastToStream(
    broadcastId: string,
    streamId: string
  ): Promise<void> {
    try {
      this.oAuth2Client.setCredentials(this.authTokens);
      const youtubeWithAuth = google.youtube({
        version: "v3",
        auth: this.oAuth2Client as any,
      });
      const bindRequest = {
        // auth: this.oAuth2Client,
        id: broadcastId,
        part: ["id,contentDetails"],
        requestBody: {
          streamId: streamId,
        },
      };

      await youtubeWithAuth.liveBroadcasts.bind(bindRequest);
    } catch (error) {
      console.error("Error binding broadcast to stream:", error.message);
      throw error;
    }
  }

  private async startLiveVideo(broadcastId: string): Promise<void> {
    try {
      this.oAuth2Client.setCredentials(this.authTokens);
      const youtubeWithAuth = google.youtube({
        version: "v3",
        auth: this.oAuth2Client as any,
      });
  
      const response = await youtubeWithAuth.liveBroadcasts.list({
        part: "snippet,contentDetails,status",
        id: broadcastId,
      });
  
      const liveBroadcast = response.data.items[0];
  
      console.log('this is live broadcast status ===> ', liveBroadcast.status);
      console.log('response data ===>', response);
  
      if (liveBroadcast && liveBroadcast.status && liveBroadcast.status.lifeCycleStatus === "live") {
        console.log("Stream is active and ready for transition.");
      } else {
        console.log("Stream is not active or ready for transition. Recreating with 'webcam' type.");
  
        // Recreate the live stream with "webcam" type and privacy status
        const recreatedResponse = await youtubeWithAuth.liveBroadcasts.insert({
          part: "snippet,contentDetails,status",
          resource: {
            snippet: {
              title: "Your Stream Title",
              description: "WebCam Stream", // Indicate that this is a webcam stream
              scheduledStartTime: new Date().toISOString(), // Set the start time to now
            },
            contentDetails: {
              monitorStream: {
                enableMonitorStream: true,
                broadcastStreamDelayMs: 0,
              },
              enableDvr: true,
              enableContentEncryption: true,
              enableEmbed: true,
              enableLowLatency: true,
              enableAutoStart: true, // Enable auto-start
              enableAutoStop: false, // Optional: Set to false if you don't want auto-stop
            },
            status: {
              privacyStatus: "public", // Set the privacy status (public, private, unlisted)
            },
            type: "none", // Set the type to "none" to potentially ensure it uses webcam
          },
        });
  
        console.log("Recreated live stream with type 'webcam'.");
        console.log("Recreated Response:", recreatedResponse.data);
      }
    } catch (error) {
      console.error("Error checking/recreating stream status:", error);
      throw error;
    }
  }
  
  
  
  
  
}
