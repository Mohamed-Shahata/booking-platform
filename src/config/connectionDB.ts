import { connect } from "mongoose";

const connectionDB = async () => {
  try {
    connect(process.env.MONGO_URI!);
  } catch (err) {
    console.log(" MongoDB connection error:", err);
    throw err;
  }
};

export default connectionDB;
