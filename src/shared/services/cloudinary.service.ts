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
      throw new AppError("Image upload faild", StatusCode.BAD_REQUEST);
    }
  }

  static async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      throw new AppError("Image deletion faild", StatusCode.BAD_REQUEST);
    }
  }
}

export default CloudinaryService;
