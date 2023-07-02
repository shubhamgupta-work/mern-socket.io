import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel";

export const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the details");
  }

  const userExists = await User.findOne({ email });
  if (!userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await User.create({ name, email, password, pic });
  if (user) {
    res.status(201).json({
      message: "User Created Successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user.");
  }
});
