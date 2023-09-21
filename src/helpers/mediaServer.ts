import * as request from "request";

export class MediaServer {
  public static upload(file,targatedFolder) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        url: process.env.MEDIA_SERVER,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        formData: {
          file: {
            value: file.data,
            options: {
              filename: file.name,
              contentType: file.mimetype || file.type,
            },
          },
          targatedFolder,
        },
      };
      request(options, async (error: any, response: any, body: any) => {
        if (response) {
          resolve({
            statusCode: response.statusCode,
            data: JSON.parse(response.body),
          });
        } else {
          reject(error);
        }
      });
    });
  }
}