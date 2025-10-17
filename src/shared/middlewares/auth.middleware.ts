import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errors/app.error";
import { AuthErrors } from "../../utils/constant";
import { StatusCode } from "../enums/statusCode.enum";
import { Types } from "mongoose";
import { UserRoles } from "../enums/UserRoles.enum";

export interface CustomJwtPayload {
  id: Types.ObjectId;
  role: string | UserRoles;
}

/**
 * Authentication middleware:
 * - Checks for the presence and format of the Authorization header.
 * - Verifies the JWT token and attaches the decoded user data to the request.
 * - Throws an appropriate AppError for missing or invalid tokens.
 *
 * @param req  Express request object
 * @param res  Express response object
 * @param next Express next middleware function
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new AppError(AuthErrors.NO_TOKEN_PROVIDED, StatusCode.UNAUTHORIZED);

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] === process.env.BEARER_PRIFIX)
      throw new AppError(AuthErrors.BAD_TOKEN_FORMAT, StatusCode.UNAUTHORIZED);

    const token = parts[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    // note: don't forget check user exsits in database

    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError")
      throw new AppError(AuthErrors.EXPIRED_TOKEN, StatusCode.UNAUTHORIZED);

    throw new AppError(AuthErrors.INVALID_TOKEN, StatusCode.FORBIDDEN);
  }
};

/**
 * Role-Based Authorization Middleware:
 * - Accepts allowed roles as parameters.
 * - Blocks access if the authenticated user's role is not permitted.
 */
export const authRoles = (...roles: Array<UserRoles>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role))
      throw new AppError(AuthErrors.ACCESS_DENIED, StatusCode.FORBIDDEN);
    next();
  };
};

/**
 * Account Ownership Middleware:
 * - Allows access only if the user is acting on their own account.
 * - Admin users bypass this restriction.
 */
export const isAccount = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.id !== req.params.userId && req.user.role !== UserRoles.ADMIN)
    throw new AppError(AuthErrors.ACCESS_DENIED, StatusCode.FORBIDDEN);
  next();
};
