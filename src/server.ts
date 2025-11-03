import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./src/config/.env"), debug: false });

import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import connectionDB from "./DB/connectionDB";
import { startSessionFinalizer } from "./jobs/sessionFinalizer";
import { deletetionExpiredUser } from "./jobs/deleteExpiredUser.job";
import { registerChatHandlers } from "./modules/Chat/chat.socket";

const PORT = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("✅ [Socket.io] New client connected:", socket.id);
  registerChatHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("❌ [Socket.io] Client disconnected:", socket.id);
  });
});

async function startServer() {
  try {
    await connectionDB();
    console.log("1 - ✅ MongoDB connected successfully");

    deletetionExpiredUser();
    console.log(`2 - ✅ Job cron deleteion user`);

    startSessionFinalizer();
    console.log(`3 - ✅ Start job cron sessions`);

    server.listen(PORT, () => {
      console.log(`🚀 Server & Socket.io running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server: ", err);
    process.exit(1);
  }
}

startServer();
