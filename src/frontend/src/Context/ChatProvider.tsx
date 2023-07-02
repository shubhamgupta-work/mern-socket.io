import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ILatestMessage {
  sender: Partial<IUser>;
  content: string;
  chat: Partial<IChat>;
}

interface IChat {
  _id: string;
  isGroupChat: boolean;
  chatName: string;
  users: IUser[];
  latestMessage: ILatestMessage;
  groupAdmin: any;
}

export interface IUser {
  name: string;
  pic: string;
  email: string;
  _id: string;
  token: string;
}

interface IContext {
  user: IUser;
  setUser: (a: IUser) => void;
  selectedChat: IChat | undefined;
  setSelectedChat: (a: any) => void;
  chats: IChat[];
  setChats: (a: IChat[]) => void;
}

const ChatContext = createContext<IContext>({
  user: { name: "", pic: "", email: "", _id: "", token: "" },
  setUser: (a: any) => {},
  selectedChat: {
    _id: "",
    isGroupChat: false,
    chatName: " ",
    users: [],
    latestMessage: { content: "", sender: {}, chat: {} },
    groupAdmin: "",
  },
  setSelectedChat: (a) => {},
  chats: [],
  setChats: (a: any) => {},
});

const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: "", pic: "", email: "", _id: "", token: "" });
  const [selectedChat, setSelectedChat] = useState({
    _id: "",
    isGroupChat: false,
    chatName: "",
    users: [{ name: "", pic: "", email: "", _id: "", token: "" }],
    latestMessage: { content: "", sender: {}, chat: {} },
    groupAdmin: "",
  });
  const [chats, setChats] = useState<IChat[]>([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    console.log({ userInfo });
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [location]);

  return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
