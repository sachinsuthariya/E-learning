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
    const thumbnail = sharp(file.data)
      .resize(100, 100)
      .toBuffer()
      .then((data: any) => {
        const thumbnailPath = path.join(
          process.cwd(),
          `uploads/images/${type}/thumbnails`
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
      `uploads/document/${type}`,
      fileName
    );

    file.mv(filePath, (err) => {
      if (err) {
        throw err;
      }
    });

    return path.join(`${type}/${fileName}`);
  }
}
