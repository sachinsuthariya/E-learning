import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";
import { Utils } from "../../../helpers/utils";
import { Media } from "../../../helpers/media";
// import { google, youtube_v3 } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';
// import * as fs from 'fs';
// import * as path from 'path';

export class CourseUtils {
  public sqlUtils: SqlUtils = new SqlUtils();
  // // YouTube Live Streaming API Integration
  // private API_KEY = 'YOUR_YOUTUBE_API_KEY';

  // private oAuth2Client: OAuth2Client;
  // private youtube: youtube_v3.Youtube;

  // // private youtube: youtube_v3.Youtube;
  // constructor() {
  //   // Initialize the YouTube API
  //   this.youtube = google.youtube({
  //     version: 'v3',
  //     auth: this.API_KEY,
  //   });
  // }
  // Create Courses
  public create = (courseDetails: Json) =>
    My.insert(Tables.COURSE, courseDetails);

  /**
   * Get Course by ID
   * @param courseDetails
   * @returns
   */
  public getById = async (courseId: string) => {
    const course = await My.first(
      Tables.COURSE,
      [
        "id",
        "title",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "materials",
        "payment_url",
        "price",
        "material_price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "id=?",
      [courseId]
    );
    course.attachment = Utils.getImagePath(course.attachment);
    return course;
  };

  /**
   * Get All Courses
   * @param courseDetails
   * @returns
   */
  public getAllCourses = async () => {
    const courses = await My.findAll(
      Tables.COURSE,
      [
        "id",
        "title",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "materials",
        "price",
        "payment_url",
        "material_price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status!=?",
      ["deleted"]
    );

    courses.map((course) => {
      course.attachment = Utils.getImagePath(course.attachment);
      return course;
    });

    return courses;
  };
  /**
   * Get All Courses
   * @param courseDetails
   * @returns
   */
  public getAllActiveCourses = async () => {
    const courses = await My.findAll(
      Tables.COURSE,
      [
        "id",
        "title",
        "description",
        "isIncludesLiveClass",
        "category_id",
        "isFree",
        "materials",
        "price",
        "payment_url",
        "material_price",
        "attachment",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      "status=?",
      ["active"]
    );

    courses.map((course) => {
      course.attachment = Utils.getImagePath(course.attachment);
      return course;
    });

    return courses;
  };

  /**
   * Course Status changed to Deleted by ID
   * @param courseDetails
   * @returns
   */
  public destroy = async (courseId: string) => {
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const course = await My.update(
      Tables.COURSE,
      { status: "deleted", deleted_at: currentTimestamp },
      "id=?",
      [courseId]
    );

    this.deleteImage(courseId);
    return course;
  };

  /**
   * Course Status changed to Draft and remove data of deleted_at column by ID
   * @param courseDetails
   * @returns
   */
  public restoreCourse = async (courseId: string) =>
    await My.update(
      Tables.COURSE,
      { status: "active", deleted_at: null },
      "id=?",
      [courseId]
    );

  /**
   * Course Update Fields by ID
   * @param courseId string
   * @param courseDetails Json
   * @returns
   */
  public updateById = async (courseId: string, courseDetails: Json) =>
    await My.update(Tables.COURSE, courseDetails, "id=?", [courseId]);

  public deleteImage = async (courseId: string) => {
    const course = await My.first(
      Tables.COURSE,
      ["id", "attachment"],
      "id = ?",
      [courseId]
    );
    if (course.attachment) {
      Media.deleteImage(course.attachment);
    }
    return;
  };

  // public async startLiveStream(courseId: string): Promise<any> {
  //   try {
  //     // Create a YouTube Live Broadcast
  //     const broadcastId = await this.createLiveBroadcast(courseId);

  //     // Create a YouTube Live Stream
  //     const streamId = await this.createLiveStream(courseId);

  //     // Associate the stream with the broadcast
  //     await this.bindBroadcastToStream(broadcastId, streamId);

  //     // Start the live video
  //     await this.startLiveVideo(broadcastId);

  //     return { broadcastId, streamId };
  //   } catch (error) {
  //     console.error('Error starting live stream:', error.message);
  //     throw error;
  //   }
  // }

  // private async createLiveBroadcast(courseId: string): Promise<string> {
  //   try {
  //     const response = await this.youtube.liveBroadcasts.insert({
  //       part: ['snippet,status'],
  //       requestBody: {
  //         snippet: {
  //           title: `Live Stream for Course ${courseId}`,
  //           description: 'Description of the live stream',
  //         },
  //         status: {
  //           privacyStatus: 'public',
  //         },
  //       },
  //     });

  //     return response.data.id;
  //   } catch (error) {
  //     console.error('Error creating live broadcast:', error.message);
  //     throw error;
  //   }
  // }

  // private async createLiveStream(courseId: string): Promise<string> {
  //   try {
  //     const response = await this.youtube.liveStreams.insert({
  //       part: ['snippet,cdn'],
  //       requestBody: {
  //         snippet: {
  //           title: `Live Stream for Course ${courseId}`,
  //           description: 'Description of the live stream',
  //         },
  //         cdn: {
  //           frameRate: '30fps',
  //           ingestionType: 'rtmp',
  //           resolution: '720p',
  //         },
  //       },
  //     });

  //     return response.data.id;
  //   } catch (error) {
  //     console.error('Error creating live stream:', error.message);
  //     throw error;
  //   }
  // }

  // private async bindBroadcastToStream(broadcastId: string, streamId: string): Promise<void> {
  //   try {
  //     await this.youtube.liveBroadcasts.bind({
  //       part: ['id,contentDetails'],
  //       id: broadcastId,
  //       requestBody: {
  //         streamId: streamId,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error binding broadcast to stream:', error.message);
  //     throw error;
  //   }
  // }

  // private async startLiveVideo(broadcastId: string): Promise<void> {
  //   try {
  //     await this.youtube.liveBroadcasts.transition({
  //       part: ['id,status'],
  //       id: broadcastId,
  //       requestBody: {
  //         broadcastStatus: 'live',
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error starting live video:', error.message);
  //     throw error;
  //   }
  // }
}
