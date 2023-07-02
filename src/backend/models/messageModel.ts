import { Schema, model, Types } from "mongoose";

interface IMessage {
  sender: Types.ObjectId;
  content: string;
  chat: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const Message = model("Message", schema);
export default Message;
