import { FC, useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import callAxios from "../utils/axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import animationData from "../animations/typing.json";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:9000";
let socket: any, selectedChatCompare: any;

const SingleChat: FC<{ fetchAgain: boolean; setFetchAgain: (a: boolean) => void }> = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const typingHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (socketConnected) {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat?._id);
      }

      let lastTypingTime = new Date().getTime();
      let timerLength = 3000;
      setTimeout(() => {
        const timeDiff = new Date().getTime() - lastTypingTime;

        if (timeDiff >= timerLength && typing) {
          setTyping(false);
          socket.emit("stop typing", selectedChat?._id);
        }
      }, timerLength);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await callAxios("get", `message/${selectedChat._id}`, {}, config);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat?._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT); //here we also set the variable set defined earlier
    socket.emit("setup", JSON.parse(localStorage.getItem("userInfo")!));
    socket.on("connection", () => {
      setSocketConnected(true); //Created new state
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (selectedChat?.chatName) {
      fetchMessages();
      selectedChatCompare = selectedChat;
      //Above line: To check if upon receiving new message, to show notification or emit
    }
  }, [selectedChat]);

  const sendMessage = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat?._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await callAxios(
          "post",
          "message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  //This useEffect without dependency will run every time the component rerenders
  //because we want it to wait to register the socket first, and in this way it will
  //have the fresh messages state which if put empty dependency array, it will not have
  useEffect(() => {
    socket.on("message received", (newMessageReceived: any) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        console.log({ newMessageReceived });
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat?.chatName ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(undefined)}
              aria-label={""}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none" }}>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler} />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
