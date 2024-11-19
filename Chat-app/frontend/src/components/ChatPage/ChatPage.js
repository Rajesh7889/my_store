import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatContextProvider";
import Header from "../header/Header";
import { Box } from "@chakra-ui/react";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const navigate=useNavigate()
  const { user } = ChatState();
  const [fetchAgain, setfetchAgain] = useState()

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);
  return (
    <div style={{ width: "100%" }}>
      {user && <Header />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w={"100%"}
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
