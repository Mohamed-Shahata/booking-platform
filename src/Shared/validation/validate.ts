import { ZodObject, ZodRawShape, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import AppError from '../errors/app.error'
import {AuthErrors} from '../../utils/constant'
import {StatusCode} from '../enums/statusCode.enum'

export const validate = (schema: ZodObject<ZodRawShape>) =>
        (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                throw new AppError(AuthErrors.VALIDTION_ERROR,StatusCode.BAD_REQUEST,error.issues)
            }
            next(error); // أي خطأ آخر
        }
    }
