import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UserListItem from "../userUnitComps/UserListItem";
import UserBadgeItem from "../userUnitComps/UserBadgeItem";
import { ChatState } from "../../Context/ChatContextProvider";
import axios from "axios";
const UpdateGroupChatModal = ({ fetchAgain, setfetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameLoading, setrenameLoading] = useState(false);

  const toast = useToast();

  //adding new user.....
  const handleAdduser = async (selectedUser) => {
    if (selectedChat.users.find((u) => u._id === selectedUser._id)) {
      toast({
        title: "User Already in Group!",
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Group Admins can add someone!",
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: selectedUser._id,
        },
        config
      );

      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setloading(false);
    } catch (err) {
      toast({
        title: "Error occured!",
        description: err.response.data.message,
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  //searching user to add....
  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setloading(false);
      setsearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setloading(false);
    }
  };

  //removing group members...
  const handleRemove = async (selectedUser) => {
    if (selectedChat.groupAdmin._id !== user._id && selectedUser !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: selectedUser._id,
        },
        config
      );

      selectedUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setfetchAgain(!fetchAgain);
        fetchMessages();
      setloading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  //renaming group...
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setrenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/renamegroup",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setrenameLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      setrenameLoading(false);
    }
    setGroupChatName("");
  };
  return (
    <>
      <IconButton
        display={{ basee: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedChat.users.map((usr) => (
                <UserBadgeItem
                  key={usr._id}
                  user={usr}
                  handleFunction={() => handleRemove(usr)}
                />
              ))}
            </Box>
            <FormControl
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Input
                placeholder="Chat Name"
                mb={3}
                mt={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />{" "}
              <Button
                colorScheme="teal"
                isLoading={renameLoading}
                onClick={() => handleRename()}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}></Box>

            {loading ? (
              <Spinner ml="auto" display={"flex"} />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAdduser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
