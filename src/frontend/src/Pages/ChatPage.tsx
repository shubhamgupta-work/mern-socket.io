import { useEffect, useState } from "react";
import callAxios from "../utils/axios";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideBar from "../components/miscellaneous/SideBar";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box display={"flex"} justifyContent={"space-between"} w={"100%"} h={"91.5vh"} p={"10px"}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
