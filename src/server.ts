import { config } from "dotenv";
import app from "./app";
import connectionDB from "./config/connectionDB";
config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1) Connect MongoDB
    connectionDB();
    console.log("1 - ✅ MongoDB connected successfully");

    // 2) Start Server
    app.listen(PORT, () =>
      console.log(`2 - ✅ Server is live on port ${PORT}`)
    );
  } catch (err) {
    console.log("Faild start server: ", err);
    process.exit(1);
  }
}

startServer();
