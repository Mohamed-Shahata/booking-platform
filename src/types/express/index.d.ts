import * as express from "express";
import { CustomJwtPayload } from "../../shared/middlewares/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}
