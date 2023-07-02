import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI!, {});
    console.log("MongoDB connected: ", conn.connection.host);
  } catch (error: any) {
    console.log(error.message);
    process.exit();
  }
};

export default connectDB;
