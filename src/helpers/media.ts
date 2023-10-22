import * as moment from "moment";
import { UploadedFile } from "express-fileupload";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs";
import { FileTypes } from "../config/enums";

export class Media {
  /**
   * Upload files
   * @param file UploadFile
   * @param type FileTypes
   * @returns string
   */
  public static uploadImage(file: UploadedFile, type: FileTypes): string {
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = moment().unix().toString() + "." + fileExtension;

    const filePath = path.join(
      process.cwd(),
      `uploads/images/${type}`,
      fileName
    );

    file.mv(filePath, (err) => {
      if (err) {
        throw err;
      }
    });

    // Create a thumbnail
    sharp(file.data)
      .resize(100, 100)
      .toBuffer()
      .then((data: any) => {
        const thumbnailPath = path.join(
          process.cwd(),
          `uploads/images/thumbnails/${type}`
        );
        // Create the directory if it doesn't exist
        if (!fs.existsSync(thumbnailPath)) {
          fs.mkdirSync(thumbnailPath, { recursive: true });
        }
        fs.writeFile(path.join(thumbnailPath, fileName), data, (err) => {
          if (err) {
            throw err;
          }
        });
      });

    return path.join(`${type}/${fileName}`);
  }

  /**
   * Upload documents doc, pdf, xml, ppt etc...
   * @param file UploadFile
   * @param type FileTypes
   * @returns string
   */
  public static uploadDocument(file: UploadedFile, type: FileTypes): string {
    const fileExtension = file.name.split(".").pop();
    const fileName = moment().unix().toString() + "." + fileExtension;

    const filePath = path.join(
      process.cwd(),
      `uploads/documents/${type}`,
      fileName
    );

    file.mv(filePath, (err) => {
      if (err) {
        throw err;
      }
    });

    return path.join(`${type}/${fileName}`);
  }

  public static deleteImage = (attachmentPath: string) => {
    if (attachmentPath) {
      const filePath = path.join(
        process.cwd(),
        "uploads/images",
        attachmentPath
      ); // Define the file path
      const thumbnailPath = path.join(
        process.cwd(),
        "uploads/images/thumbnails/",
        attachmentPath
      );

      // Check if the file exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    return;
  };

  public static deleteDocument = (attachmentPath: string) => {
    if (attachmentPath) {
      const filePath = path.join(
        process.cwd(),
        "uploads/documents",
        attachmentPath
      );

      // Check if the file exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    }
    return;
  };
}
