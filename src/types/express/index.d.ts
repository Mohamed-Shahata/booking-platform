import * as express from "express";
import { Types } from "mongoose";
import { CustomRequest } from "../../shared/middlewares/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: CustomRequest;
    }
  }
}
