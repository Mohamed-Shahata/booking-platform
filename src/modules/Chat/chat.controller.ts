import { Request, Response } from "express";
import Chat from "../../DB/model/chat.model";
import sendResponse from "../../shared/utils/sendResponse";
import { StatusCode } from "../../shared/enums/statusCode.enum";

class ChatController {
  public getMessagesBySession = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const messages = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    sendResponse(res, StatusCode.OK, { data: { messages }, success: true });
  };
}

export default ChatController;
