import { model, Schema } from "mongoose";
import { IChat } from "../../modules/Chat/chat.type";

const chatSchema = new Schema<IChat>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Chat = model<IChat>("Chat", chatSchema);
export default Chat;
