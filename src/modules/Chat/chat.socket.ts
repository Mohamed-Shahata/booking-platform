import { Server, Socket } from "socket.io";
import Chat from "../../DB/model/chat.model";
import User from "../../DB/model/user.model";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import Session from "../../DB/model/session.model";
import { SessionStatus } from "../Session/session.enum";

export const registerChatHandlers = (io: Server, socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join-room", async ({ sessionId, userId }) => {
    try {
      if (!sessionId || !userId)
        return socket.emit("error", { message: "Missing join-room data" });

      const roomId = String(sessionId);

      const session = await Session.findById(sessionId);
      if (!session) {
        socket.emit("session-closed", {
          message: "This session does not exist.",
        });
        return;
      }

      if (!session || session.status !== SessionStatus.IN_PROGRESS) {
        socket.emit("session-closed", {
          message: `This session is ${session.status}, you can't join.`,
        });
        return;
      }

      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);

      const user = await User.findById(userId);
      if (user?.role === UserRoles.EXPERT) {
        await Session.findByIdAndUpdate(sessionId, {
          expertJoinedAt: new Date(),
        });
      }

      socket.to(roomId).emit("user-joined", { userId });
    } catch (err) {
      console.error("Error in join-room:", err);
      socket.emit("error", { message: "Server error while joining room" });
    }
  });

  socket.on("send-message", async ({ sessionId, from, to, message }) => {
    try {
      if (!sessionId || !message)
        return socket.emit("error", { message: "Missing message data" });

      const roomId = String(sessionId);

      const session = await Session.findById(sessionId);
      if (!session || session.status !== SessionStatus.IN_PROGRESS) {
        socket.emit("session-closed", {
          message: `Can't send message. Session is ${
            session?.status || "invalid"
          }.`,
        });
        return;
      }

      const msg = await Chat.create({
        sessionId,
        from,
        to,
        message,
        createdAt: new Date(),
      });

      console.log("Message saved:", msg);
      io.to(roomId).emit("new-message", msg);
    } catch (err) {
      console.error("Error in send-message:", err);
      socket.emit("error", { message: "Server error while sending message" });
    }
  });

  socket.on("leave-room", ({ sessionId, userId }) => {
    const roomId = String(sessionId);
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", { userId });
  });
};
