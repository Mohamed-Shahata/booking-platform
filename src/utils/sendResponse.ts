import { Response } from "express";
import { StatusCode } from "../Shared/enums/statusCode.enum";

interface ResponsePayload {
  success: boolean;
  message: string | null;
  data: any;
  errors: any;
  [key: string]: any;
}

/**
 * Unified response helper:
 * - Sends a consistent JSON response structure across the application.
 * - Accepts a flexible payload object to allow additional custom fields (e.g., token, meta).
 *
 * @param res     Express response object
 * @param status  HTTP status code
 * @param payload Response body (message, data, errors, and any extra fields)
 */

const sendResponse = (
  res: Response,
  status: StatusCode,
  payload: ResponsePayload
) => {
  res.status(status || 500).json({
    ...payload,
  });
};

export default sendResponse;
