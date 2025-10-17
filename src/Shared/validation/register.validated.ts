import { ZodObject, ZodRawShape, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

export class Validator<T extends ZodRawShape> {
    private schema: ZodObject<T>;

    constructor(schema: ZodObject<T>) {
        this.schema = schema;
    }

    public validate = 
        (req: Request, res: Response, next: NextFunction) => {
        try {
            this.schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((e) => e.message),
            });
            }
            next(error); // أي خطأ آخر
        }
    }
}
