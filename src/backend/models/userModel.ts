import { Schema, Types, model, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  pic: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserMethods {
  correctPassword: (a: string, b: string) => Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
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

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.correctPassword = async function (
  toCheckPassword: string,
  savedPassword: string
) {
  return await bcrypt.compare(toCheckPassword, savedPassword);
};

const User = model("User", schema);
export default User;
