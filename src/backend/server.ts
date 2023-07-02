////Main Imports
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config();

///Route Imports
import userRoutes from "./routes/userRoutes";

//Basic Stuff
connectDB();
const app = express();
const port = process.env.BACKEND_PORT || 9000;

//Routes
app.get("/", (_, res) => {
  res.send("Welcome to the Chat backend.");
});

app.use("/api/user", userRoutes);

//Server started
app.listen(port, () => console.log(`Server started on port ${port}`));
