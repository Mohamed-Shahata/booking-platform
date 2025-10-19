import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import AppError from "../errors/app.error";
import { StatusCode } from "../enums/statusCode.enum";
import { ValidationError } from "../../utils/constant";

const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new AppError(
          ValidationError.VALIDATION_ERROR,
          StatusCode.BAD_REQUEST,
          err.issues
        );
      }
      next(err);
    }
  };

export default validate;
