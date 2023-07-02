import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel";
import { ReqWithUser } from "../types/requestType";

export const accessChat = expressAsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    res.sendStatus(400);
    return console.log("UserId param not sent with request");
  }

  const isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: (req as ReqWithUser).user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      populate: [{ path: "sender", select: "-password" }],
    });

  if (isChat) {
    res.status(200).send(isChat);
  } else {
    const chat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [userId, (req as ReqWithUser).user._id],
    });
    const fullChat = await Chat.findById(chat._id).populate("users", "-password");
    res.status(200).send(fullChat);
  }
});

export const fetchChats = expressAsyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    users: (req as ReqWithUser).user._id,
  })
    .populate({
      path: "latestMessage",
      populate: [{ path: "sender", select: "-password" }],
    })
    .populate("groupAdmin", "-password")
    .populate("users", "-password")
    .sort("-updatedAt");
  res.status(200).send(chats);
});

export const createGroupChat = expressAsyncHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ message: "Please fill all the fields" });
    return;
  }

  const users: string[] = JSON.parse(req.body.users);

  if (users.length < 2) {
    res.status(400).send({
      message: "More than two users are required to create a group chat",
    });
    return;
  }

  users.push((req as ReqWithUser).user._id!);

  const groupChat = await Chat.create({ isGroupChat: true, chatName: req.body.name, users, groupAdmin: (req as ReqWithUser).user._id });

  const fullGroupChat = await Chat.findById(groupChat._id).populate("groupAdmin", "-password").populate("users", "-password");

  res.status(200).json(fullGroupChat);
});

export const renameGroup = expressAsyncHandler(async (req, res, next) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate("groupAdmin", "-password")
    .populate("users", "-password");

  res.status(200).send(updatedChat);
});

export const addToGroup = expressAsyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(chatId, { $addToSet: { users: userId } }, { new: true })
    .populate("groupAdmin", "-password")
    .populate("users", "-password");

  res.status(200).send(added);
});

export const removeFromGroup = expressAsyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
    .populate("groupAdmin", "-password")
    .populate("users", "-password");

  res.status(200).send(removed);
});
