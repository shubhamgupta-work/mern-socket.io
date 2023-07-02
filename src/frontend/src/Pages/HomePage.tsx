import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    if (userInfo) {
      navigate("/chats");
    }
  }, []);

  return (
    <Container maxW="xl" centerContent>
      <Box display="flex" justifyContent="center" p={3} bg={"white"} w="100%" m="40px 0 15px 0" borderRadius={"lg"} borderWidth={"1px"}>
        <Text fontSize={"4xl"} fontFamily={"Work Sans"} color={"black"}>
          Talk-A-Tive
        </Text>
      </Box>
      <Box p={4} bg={"white"} w="100%" borderRadius={"lg"} borderWidth={"1px"} color={"black"}>
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
