import { Types } from "mongoose";
import { CustomRequest } from "../../shared/middlewares/auth.middleware";
import { SessionService } from "./session.service";
import sendResponse from "../../shared/utils/sendResponse";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { Request, Response } from "express";

export class SessionController {
  private sessionService: SessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  public createSession = async (req: CustomRequest, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id);

    const dto = req.body;

    const session = await this.sessionService.createSession(userId, dto);

    sendResponse(res, StatusCode.CREATED, { data: { session }, success: true });
  };

  public start = async (req: Request, res: Response) => {
    const sessionId = new Types.ObjectId(req.params.sessionId);

    const session = await this.sessionService.startSession(sessionId);

    sendResponse(res, StatusCode.OK, { data: { session }, success: true });
  };

  public complete = async (req: Request, res: Response) => {
    const sessionId = new Types.ObjectId(req.params.sessionId);

    const session = await this.sessionService.completeSession(sessionId);

    sendResponse(res, StatusCode.OK, { data: { session }, success: true });
  };
}

export const sessionController = new SessionController();
