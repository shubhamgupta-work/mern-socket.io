import { Schema, model, Types } from "mongoose";

interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: Types.Array<Types.ObjectId>;
  latestMessage: Types.ObjectId;
  groupAdmin: Types.ObjectId;
}

const schema = new Schema<IChat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = model("Chat", schema);
export default Chat;
