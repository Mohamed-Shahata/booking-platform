import { NextFunction, Request, Response } from "express";
import AppError from "../errors/app.error";
import sendResponse from "../utils/sendResponse";
import { ServerErrors } from "../utils/constant";

/**
 * Global Error Handling Middleware:
 * - Captures thrown AppError instances across the application.
 * - Sends a structured JSON response with status, message, and error details.
 * - Ensures the server responds gracefully instead of crashing.
 *
 * @param err  Thrown error (expected AppError)
 * @param req  Express request object
 * @param res  Express response object
 * @param next Express next function
 */
const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err)
    return sendResponse(res, err.status, {
      success: false,
      message: err.message || ServerErrors.INTERNAL_SERVER_ERROR,
      data: null,
      errors: err.errors,
    });
  next();
};

export default errorHandler;
