import multer from "multer";
import path from "path";
import fs from "fs";
import AppError from "../errors/app.error";
import { StatusCode } from "../enums/statusCode.enum";

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

/**
 * Configure how files are stored temporarily on disk
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/**
 * File filter to allow only image types
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.mimetype))
    return cb(
      new AppError(
        "Only image files are allowed (jpg, png, webp)",
        StatusCode.BAD_REQUEST
      ),
      false
    );
  cb(null, true);
};

/**
 * Initialize Multer upload middleware
 *
 * - Uses the configured storage and file filter
 * - Sets a file size limit (5 MB)
 */
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fieldSize: 5 * 1024 * 1024 }, // 5 MB
});

/**
 * Initialize Multer upload middleware
 *
 * - Uses the configured storage and file filter
 * - Sets a file size limit (5 MB)
 */
export const uploadFile = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fieldSize: 5 * 1024 * 1024 }, // 5 MB
});
