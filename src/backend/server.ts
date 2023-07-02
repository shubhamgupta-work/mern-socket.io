////Main Imports
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import * as errorHandlers from "./middlewares/errorMiddleware";
import morgan from "morgan";
dotenv.config();

///Route Imports
import { protect } from "./middlewares/authMiddleware";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

//Basic Stuff
connectDB();
const app = express();
const port = process.env.BACKEND_PORT || 9000;

//Utilities
app.use(express.json());
app.use(morgan("dev"));

//Routes
app.get("/", (_, res) => {
  res.send("Welcome to the Chat backend.");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", protect, chatRoutes);

//Error and 404 Handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

//Server started
app.listen(port, () => console.log(`Server started on port ${port}`));
