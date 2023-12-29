import bcryptjs = require("bcryptjs");
import { Request, Response, response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { TestSeriesUtils } from "./testSeriesUtils";
import { Utils } from "../../../helpers/utils";
import { Media } from "../../../helpers/media";
import { FileTypes } from "../../../config/enums";
// import { google, youtube_v3 } from "googleapis";
// import { OAuth2Client } from "google-auth-library";
import axios from 'axios';

export class TestSeriesController {
  private testSeriesUtils: TestSeriesUtils = new TestSeriesUtils();

  public create = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      console.log(req.body);
      const image = req.files.image;
      if (image) {
        req.body.attachment = Media.uploadImage(image, FileTypes.TEST_SERIES);
      }
      await this.testSeriesUtils.create(req.body);
      const testSeries = await this.testSeriesUtils.getById(req.body.id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        testSeries
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
      
      const enquiry = await this.testSeriesUtils.createEnquiry(req.body);

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
  public createTest = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      console.log(req.body)
      const image = req.files.image;
      if (image) {
        req.body.attachment = Media.uploadImage(image, FileTypes.EXAMS)
      }
      await this.testSeriesUtils.testSeriesTest(req.body);
      const exam = await this.testSeriesUtils.getTestById(req.body.id);
      
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        exam
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log( "testSeries video ===>", err);
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

      const updateVideo = await this.testSeriesUtils.updateByIdTestSeriesVideo(
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

      const video = await this.testSeriesUtils.getVideoById(videoId);

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
  public updateTest = async (req: any, res: Response) => {
    try {
      // return req;
      const testId = req.params.id;
      const loginUserId = req.user && req.user.id ? req.user.id : null;
      // console.log(req.user.role);
      // return;
      if(req.files){

        const image = req.files.image;
        
        if (image) {
          req.body.attachment = Media.uploadImage(image, FileTypes.EXAMS)
          this.testSeriesUtils.deleteImage(testId)
        }
      }
      
      const updateTest = await this.testSeriesUtils.updateByIdTestSeriesTest(
        testId,
        req.body
      );

      if (!updateTest || !updateTest.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("VIDEO_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const test = await this.testSeriesUtils.getTestById(testId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        test
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

  public createExamCategory = async (req: any, res: Response) => {
    try {
        req.body.id = Utils.generateUUID();
        const category = await this.testSeriesUtils.examCategory(req.body);
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public updateExamCategory = async (req: any, res: Response) => {
    try {
        const categoryId  = req.params.id;
        const category = await this.testSeriesUtils.updateExamCategory(
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
  public allExamCategories = async (req: any, res: Response) => {
    try {
        const examCategories = await this.testSeriesUtils.allExamCategories();
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), examCategories);
        return res.status(response.code).json(response);
    } catch (err) {
        console.log(err);
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public examCategoryById = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        const category = await this.testSeriesUtils.getByIdExamCategory(id);
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public getTestById = async (req: any, res: Response) => {
    try {
      const test_id = req.params.id;
      const test = await this.testSeriesUtils.getTestById(test_id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        test
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
  public getExamCategoriesByTestSeriesId = async (req: any, res: Response) => {
    try {
      const testSeries_id = req.params.id;
        const category = await this.testSeriesUtils.getExamCategoriesByTestSeries(testSeries_id);
        
        const response = ResponseBuilder.genSuccessResponse(Constants.SUCCESS_CODE, req.t("SUCCESS"), category);
        return res.status(response.code).json(response);
    } catch (err) {
        const response = ResponseBuilder.genErrorResponse(Constants.INTERNAL_SERVER_ERROR_CODE, req.t("ERR_INTERNAL_SERVER"));
        return res.status(response.error.code).json(response);
    }
  }
  public getTestsByCategoryId = async (req: any, res: Response) => {
    try {
      const category_id = req.params.id;
        const category = await this.testSeriesUtils.getTestsByCategoryId(category_id);
        
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
      console.log(req.params.id);
      const id = req.params.id;
      const loginUserId = req.user && req.user.id ? req.user.id : null;
      console.log(id,loginUserId);
      // return;
      const testSeries = await this.testSeriesUtils.getById(id,loginUserId ?? null);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        testSeries
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
  public allTestSeries = async (req: any, res: Response) => {
    try {
      const testSeries = await this.testSeriesUtils.getAllTestSeries();
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        testSeries
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
  public allTestSeriesEnquiries = async (req: any, res: Response) => {
    try {
      const enquiries = await this.testSeriesUtils.getAllEnquiries();
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
  public appAllTestSeries = async (req: any, res: Response) => {
    try {
      const testSeries = await this.testSeriesUtils.getAllActiveTestSeries();
      // console.log(testSeries);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        testSeries
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
      const testSeries = await this.testSeriesUtils.destroy(id);

      if (!testSeries || !testSeries.affectedRows) {
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
      const testSeries = await this.testSeriesUtils.destroyVideo(id);

      if (!testSeries || !testSeries.affectedRows) {
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
      const testSeries = await this.testSeriesUtils.restoreTestSeries(id);

      if (!testSeries || !testSeries.affectedRows) {
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
      const testSeriesId = req.params.id;
      const image = req.files.image;
      const testSeriesDetails: any = {
        title: req.body.title,
        description: req.body.description,
        isFree: req.body.isFree,
        price: req.body.price,
        payment_url: req.body.payment_url,
        status: req.body.status,
      };

      if (image) {
        testSeriesDetails.attachment = Media.uploadImage(image, FileTypes.TEST_SERIES);
        await this.testSeriesUtils.deleteImage(testSeriesId);
      }

      const updateTestSeries = await this.testSeriesUtils.updateById(
        testSeriesId,
        testSeriesDetails
      );

      if (!updateTestSeries || !updateTestSeries.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const testSeries = await this.testSeriesUtils.getById(testSeriesId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        testSeries
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
      const testSeriesId = req.params.id;
      const testSeriesDetails = {
        status: req.body.status,
      };

      const updateTestSeries = await this.testSeriesUtils.updateById(
        testSeriesId,
        testSeriesDetails
      );

      if (!updateTestSeries || !updateTestSeries.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const testSeries = await this.testSeriesUtils.getById(testSeriesId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        testSeries
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

  public enrolledTestSeries = async (req: any, res: Response) => {
    try {
      const loginUserId = req.user && req.user.id ? req.user.id : null;

      const enrolledTestSeries = await this.testSeriesUtils.userEnrolledTestSeries(loginUserId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledTestSeries
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
  public enrolledTestSeriesCheckAdmin = async (req: any, res: Response) => {
    try {
      const userId = req.params.id;
      const enrolledTestSeries = await this.testSeriesUtils.userEnrolledTestSeries(userId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledTestSeries
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
  public userTestSeriesDelete = async (req: any, res: Response) => {
    try {
      const testSeriesId = req.params.testSeriesId;
      const userId = req.params.userId;
      console.log('testSeriesId ===>',testSeriesId,'userId===>',userId);
      // return;
      const deleteUserTestSeries = await this.testSeriesUtils.userEnrolledTestSeriesDelete(testSeriesId,userId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        deleteUserTestSeries
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
  public enrollTestSeriesUser = async (req: any, res: Response) => {
    try {
      // console.log(req);
      // return;
      const testSeriesId = req.params.id;
      const studentId = req.body.student_id;
      // console.log("user Id :", req.user);
      const enroll = await this.testSeriesUtils.studentEnrollment(testSeriesId, studentId);

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
      const testSeriesId = req.params.id;
      // return loginUserId;
      const enrolledStudents = await this.testSeriesUtils.testSeriesEnrolledStudents(testSeriesId);
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
  public getTestQuestions = async (req: any, res: Response) => {
    try {
      const examId = req.params.id;
      const userId = req.user && req.user.id ? String(req.user.id) : "1";

      const questions = await this.testSeriesUtils.getTestQuestions(examId, userId);
      for (const question of questions) {
        if (question.mcqOptions) {
          const mcqOptions = "[" + question.mcqOptions + "]";
          question.mcqOptions = JSON.parse(mcqOptions);
        }
      }

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        questions
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
  public enrollTestUser = async (req: any, res: Response) => {
    try {
      const examId = req.params.id;
      const userId = req.user && req.user.id ? req.user.id : null;
      console.log("user Id :", req.user);
      const enroll = await this.testSeriesUtils.userEnrollment(examId, userId);

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
  };
  public submitAnswer = async (req: any, res: Response) => {
    try {
      const examId = req.params.id;
      const questionId = req.params.questionId;
      const userId = req.user && req.user.id ? req.user.id : null;
      const mcqId = req.body.mcqId;
      // console.log(userId);
      const answer = await this.testSeriesUtils.submitAnswer(
        examId,
        questionId,
        userId,
        mcqId
      );
      console.log(answer);
      if (answer && answer.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS"),
          answer
        );
        return res.status(response.code).json(response);
      } else {
        const response = ResponseBuilder.genErrorResponse(
          Constants.FAIL_CODE,
          req.t("SOMETHING_WENT_WRONG")
        );
        return res.status(response.error.code).json(response);
      }
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public testComplete = async (req: any, res: Response) => {
    try {
      const examId = req.params.id;
      const userId = req.user && req.user.id ? req.user.id : null;
      // console.log(userId);
      const answer = await this.testSeriesUtils.testComplete(
        examId,
        userId
      );
      if (answer && answer.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.SUCCESS_CODE,
          req.t("SUCCESS"),
          answer
        );
        return res.status(response.code).json(response);
      } else {
        const response = ResponseBuilder.genErrorResponse(
          Constants.FAIL_CODE,
          req.t("SOMETHING_WENT_WRONG")
        );
        return res.status(response.error.code).json(response);
      }
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
