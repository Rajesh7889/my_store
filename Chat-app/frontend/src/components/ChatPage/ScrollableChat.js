import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatContextProvider";
import {
  isLastMessag,
  isSameSender,
  isSameSenderMagin,
  isSameUser,
} from "../config/ChatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages?.map((mes, indx) => (
        <div style={{ display: "flex" }} key={mes._id}>
          {(isSameSender(messages, mes, indx, user._id) ||
            isLastMessag(messages, indx, user._id)) && (
            <Tooltip label={mes.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt={"7px"}
                mr={1}
                size={"sm"}
                cursor={"pointer"}
                name={mes.sender.name}
                src={mes.sender.pic}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${
                mes.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              marginLeft: isSameSenderMagin(messages, mes, indx, user._id),
              marginTop: isSameUser(messages, mes, indx, user._id) ? 3 : 10,
            }}
          >
            {mes.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
