import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel";
import generateToken from "../config/generateToken";
import { ReqWithUser } from "../types/requestType";

export const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  const body: any = { name, email, password };
  if (pic) {
    body.pic = pic;
  }

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the details");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await User.create(body);
  if (user) {
    res.status(201).json({
      message: "User Created Successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user.");
  }
});

export const authUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user?.correctPassword(password, user.password))) {
    res.status(200).json({
      message: "User Created Successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const allUsers = expressAsyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: (req as ReqWithUser).user._id },
  });
  res.status(200).send(users);
});
