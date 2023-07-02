import { useEffect, useState } from "react";
import callAxios from "../utils/axios";

const ChatPage = () => {
  const [chats, setChats] = useState<any[]>([]);

  const getChats = async () => {
    try {
      const { data } = await callAxios("get", "chat");
      setChats(data);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default ChatPage;
