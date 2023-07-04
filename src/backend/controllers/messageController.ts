import expressAsyncHandler from "express-async-handler";
import Message from "../models/messageModel";
import { ReqWithUser } from "../types/requestType";
import Chat from "../models/chatModel";
import { populate } from "dotenv";

export const sendMessage = expressAsyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed to the request");
    res.sendStatus(400);
  }

  const message = await Message.create({ content, chat: chatId, sender: (req as ReqWithUser).user._id });
  const newMessage = await Message.findById(message._id)
    .populate("sender", "name pic")
    .populate({
      path: "chat",
      populate: {
        path: "users",
        select: "name email pic",
      },
    });

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message._id,
  });

  res.json(newMessage);
});

export const allMessages = expressAsyncHandler(async (req, res, next) => {
  const messages = await Message.find({ chat: req.params.chatId }).populate("chat").populate("sender", "name pic email");
  res.json(messages);
});
