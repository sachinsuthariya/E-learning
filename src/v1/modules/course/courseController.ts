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
  private meetingId = "0oXQ0FacQAGnsPXIVPbmGA"
  private meetingSecret = "93zH28E6dyZVocg1iNTKv1hOJMSsWMdg"
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
  public createEnquiry = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      const currentTimestamp = new Date()
                              .toISOString()
                              .slice(0, 19)
                              .replace("T", " ");
      req.body.purchase_date  = currentTimestamp;
      
      const enquiry = await this.courseUtils.createEnquiry(req.body);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enquiry
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
  public createVideo = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      console.log(req.body);
      // return;
      const image = req.files.image;
      if (image) {
        req.body.thumbnail = Media.uploadImage(image, FileTypes.COURSE_VIDEOS);
      }

      const video = await this.courseUtils.courseVideo(req.body);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        video
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log( "course video ===>", err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public updateVideoLiveStatus = async (req: any, res: Response) => {
    try {
      // return req.body;
      const videoId = req.params.id;

      const updateVideo = await this.courseUtils.updateByIdCourseVideo(
        videoId,
        req.body
      );

      if (!updateVideo || !updateVideo.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("VIDEO_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const video = await this.courseUtils.getVideoById(videoId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        video
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
  public updateVideo = async (req: any, res: Response) => {
    try {
      // return req.body;
      const videoId = req.params.id;
      const image = req.files.image;
      if (image) {
        req.body.thumbnail = Media.uploadImage(image, FileTypes.COURSE_VIDEOS);
        await this.courseUtils.deleteVideoImage(videoId);
      }

      const updateVideo = await this.courseUtils.updateByIdCourseVideo(
        videoId,
        req.body
      );

      if (!updateVideo || !updateVideo.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("VIDEO_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const video = await this.courseUtils.getVideoById(videoId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        video
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

  public createMaterials = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();

      const image = req.files.image;
      if (image) {
        req.body.thumbnail = Media.uploadImage(image, FileTypes.COURSE_MATERIALS);
      }
      const material = req.files.file;
      if (material) {
        req.body.file = Media.uploadDocument(material, FileTypes.COURSE_MATERIALS);
      }

      const materials = await this.courseUtils.courseMaterial(req.body);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        materials
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

  public updateMaterial = async (req: any, res: Response) => {
    try {
      const materialId = req.params.id;
      const image = req.files.image;

      if (image) {
        req.body.thumbnail = Media.uploadImage(image, FileTypes.COURSE_MATERIALS);
        await this.courseUtils.deleteMaterialImage(materialId);
      }
      const materialFile = req.files.file;
      if (materialFile) {
        req.body.file = Media.uploadDocument(materialFile, FileTypes.COURSE_MATERIALS);
        await this.courseUtils.deleteMaterialFile(materialId);
        
      }

      const updateMaterial = await this.courseUtils.updateByIdCourseMaterial(
        materialId,
        req.body
      );

      if (!updateMaterial || !updateMaterial.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const material = await this.courseUtils.getMaterialById(materialId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        material
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
  public createVideoCategory = async (req: any, res: Response) => {
    try {
        req.body.id = Utils.generateUUID();
        const category = await this.courseUtils.videoCategory(req.body);
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public updateVideoCategory = async (req: any, res: Response) => {
    try {
        const categoryId  = req.params.id;
        const category = await this.courseUtils.updateVideoCategory(
          categoryId,
          req.body
        );
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public allVideoCategories = async (req: any, res: Response) => {
    try {
        const videoCategories = await this.courseUtils.allVideoCategories();
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), videoCategories);
        return res.status(response.code).json(response);
    } catch (err) {
        console.log(err);
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public videoCategoryById = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        const category = await this.courseUtils.getByIdVideoCategory(id);
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public getVideoById = async (req: any, res: Response) => {
    try {
      const video_id = req.params.id;
      const video = await this.courseUtils.getVideoById(video_id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        video
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
  public getVideoCategoriesByCourseId = async (req: any, res: Response) => {
    try {
      const course_id = req.params.id;
        const category = await this.courseUtils.getVideoCategoriesByCourse(course_id);
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public getVideosByCategoryId = async (req: any, res: Response) => {
    try {
      const category_id = req.params.id;
        const category = await this.courseUtils.getVideosByCategoryId(category_id);
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
public createMaterialCategory = async (req: any, res: Response) => {
  try {
      req.body.id = Utils.generateUUID();
      const category = await this.courseUtils.materialCategory(req.body);
      
      const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
      return res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
  }
}
public updateMaterialCategory = async (req: any, res: Response) => {
  try {
      const categoryId  = req.params.id;
      const category = await this.courseUtils.updateMaterialCategory(
        categoryId,
        req.body
      );
      
      const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
      return res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
  }
}
public allMaterialCategories = async (req: any, res: Response) => {
  try {
      const materialCategories = await this.courseUtils.allMaterialCategories();
      const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), materialCategories);
      return res.status(response.code).json(response);
  } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
  }
}
public getMaterialById = async (req: any, res: Response) => {
  try {
    const material_id = req.params.id;
    const material = await this.courseUtils.getMaterialById(material_id);

    const response = ResponseBuilder.genSuccessResponse(
      Constants.SUCCESS_CODE,
      req.t("SUCCESS"),
      material
    );
    console.log(response);
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
public materialCategoryById = async (req: any, res: Response) => {
  try {
      const id = req.params.id;
      const category = await this.courseUtils.getByIdMaterialCategory(id);
      
      const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
      return res.status(response.code).json(response);
  } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
  }
}
public getMaterialCategoriesByCourseId = async (req: any, res: Response) => {
  try {
    const course_id = req.params.id;
      const category = await this.courseUtils.getMaterialCategoriesByCourse(course_id);
      
      const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
      return res.status(response.code).json(response);
  } catch (err) {
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
  }
}
public getMaterialsByCategoryId = async (req: any, res: Response) => {
  try {
    const category_id = req.params.id;
      const category = await this.courseUtils.getMaterialsByCategoryId(category_id);
      
      const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
      return res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
      const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.error.code).json(response);
  }
}
  public getById = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const loginUserId = req.user && req.user.id ? req.user.id : null;
      console.log(id,loginUserId);
      // return;
      const course = await this.courseUtils.getById(id,loginUserId);

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
  public allCourseEnquiries = async (req: any, res: Response) => {
    try {
      const enquiries = await this.courseUtils.getAllEnquiries();
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enquiries
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
  public deleteVideo = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const course = await this.courseUtils.destroyVideo(id);

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
  public deleteMaterial = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const course = await this.courseUtils.destroyMaterial(id);

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
        const KJUR = require('jsrsasign');
        const { meetingNumber, role } = req.body;
        const iat = Math.round(new Date().getTime() / 1000) - 30;
        const exp = iat + 60 * 60 * 2
      
        const oHeader = { alg: 'HS256', typ: 'JWT' }
      
        const oPayload = {
          sdkKey: this.meetingId,
          mn: meetingNumber,
          role: role,
          iat: iat,
          exp: exp,
          appKey: this.meetingId,
          tokenExp: iat + 60 * 60 * 2
        }
      
        const sHeader = JSON.stringify(oHeader)
        const sPayload = JSON.stringify(oPayload)
        const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, this.meetingSecret)
        
        // const iat = Math.round(new Date().getTime() / 1000) - 30;
        // const exp = iat + 60 * 60 * 2

        // const oHeader = { alg: 'HS256', typ: 'JWT' }

        // const oPayload = {
        //   sdkKey: this.meetingId,
        //   mn: meetingNumber,
        //   role: role,
        //   iat: iat,
        //   exp: exp,
        //   appKey: this.meetingId,
        //   tokenExp: iat + 60 * 60 * 2
        // }

        // const sHeader = JSON.stringify(oHeader)
        // const sPayload = JSON.stringify(oPayload)
        // const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, this.meetingSecret)
        
        // const timestamp = new Date().getTime() - 30000;
        // const message = Buffer.from(this.meetingId + meetingNumber + timestamp + role).toString('base64');
        // const hash = require('crypto').createHmac('sha256', this.meetingSecret).update(message).digest('base64');
    
        // const signature = Buffer.from(`${this.meetingId}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
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
                "waiting_room": false
            }
        });
        const meetingResponse = await axios.post(`${this.api_base_url}/users/me/meetings`, data, { headers });

        if (meetingResponse.status !== 201) {
            return 'Unable to generate meeting link';
        }
        const response_data = meetingResponse.data;
        const registrantToken = response_data.join_url.split('?')[1];

        const startUrl = response_data.start_url;
        const zakToken = new URL(startUrl).searchParams.get('zak');

        // console.log(response_data);
        const content = {
            id: response_data.id,
            meeting_url: response_data.join_url,
            meetingTime: response_data.start_time,
            password: response_data.password,
            purpose: response_data.topic,
            duration: response_data.duration,
            message: 'Success',
            status: 1,
            registrantToken: registrantToken,
            zak: zakToken
        };
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS"),
          content
        );
        return res.status(response.code).json(content);

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
  public userCourseDelete = async (req: any, res: Response) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.params.userId;
      console.log('courseId ===>',courseId,'userId===>',userId);
      // return;
      const deleteUserCourse = await this.courseUtils.userEnrolledCourseDelete(courseId,userId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        deleteUserCourse
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
