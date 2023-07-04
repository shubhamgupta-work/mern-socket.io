////Main Imports
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import * as errorHandlers from "./middlewares/errorMiddleware";
import morgan from "morgan";
import socketIO from "socket.io";
dotenv.config();

///Route Imports
import { protect } from "./middlewares/authMiddleware";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRouter";
import { IUser } from "./models/userModel";

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
app.use("/api/message", protect, messageRoutes);

//Error and 404 Handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

//Server started
const server = app.listen(port, () => console.log(`Server started on port ${port}`)); // normal express server is assigned to a variable after starting

const io = new socketIO.Server(server, {
  pingInterval: 60000, //waits for this much time before it closes the socket
  cors: {
    origin: "http://localhost:3000", //Allowed cors for a specific url
  },
});

//Now building event handlers
io.on("connection", (socket) => {
  // This on gets triggers when someone tries to 'connect' to this server, meaning a frontend
  console.log("connected to socket.io");

  //Creating a person's own personal room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("---", userData._id);
    socket.emit("connection");
  });

  //A room is a store where multiple sockets can subscribe/join
  //A chat is a room where to socket connections of two members of the chat join
  //In a group chat, a room will be which all the members of group chat join
  //Rooms are created/join with join method

  //Making users to join chat
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined the room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //emitting new message sent by a user to all the users in a room
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users?.length) {
      console.log("chat.users not found  ");
    }
    chat.users.forEach((user: IUser) => {
      //Skipping the sender of the message from sending the message
      if (user._id == newMessageReceived.sender._id) return;
      //send the rest of the users message, into their own personal room
      //created at the begining of the socket code
      socket.in(user._id!).emit("message received", newMessageReceived);
    });
  });

  //Closing the socker
  socket.off("setup", (userData) => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
