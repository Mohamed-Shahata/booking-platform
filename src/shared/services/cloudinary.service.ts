import cloudinary from "../../config/cloudinary.config";
import fs from "fs";
import AppError from "../errors/app.error";
import { StatusCode } from "../enums/statusCode.enum";

class CloudinaryService {
  static async uploadImage(filePath: string, folder = "uploads") {
    try {
      const result = await cloudinary.uploader.upload(filePath, { folder });

      fs.unlinkSync(filePath);

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (err) {
      if (filePath) fs.unlinkSync(filePath);
      console.log(err);
      throw new AppError("file upload faild", StatusCode.BAD_REQUEST);
    }
  }

  static async deleteImageOrFile(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      throw new AppError("Image deletion faild", StatusCode.BAD_REQUEST);
    }
  }

  static async uploadStreamFile(fileBuffer: Buffer, folder = "cv") {
    try {
      const result = await new Promise<{ url: string; publicId: string }>(
        (resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
              if (error || !result) {
                reject(
                  new AppError("File upload failed", StatusCode.BAD_REQUEST)
                );
              }

              resolve({
                url: result?.secure_url!,
                publicId: result?.public_id!,
              });
            }
          );
          upload.end(fileBuffer);
        }
      );
      return result;
    } catch (err) {
      console.error(err);
      throw new AppError("Stream upload failed", StatusCode.BAD_REQUEST);
    }
  }
}

export default CloudinaryService;
