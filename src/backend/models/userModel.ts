import { Schema, Types, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  pic: string;
  isAdmin: boolean;
}

const schema = new Schema<IUser>(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("User", schema);
export default User;
