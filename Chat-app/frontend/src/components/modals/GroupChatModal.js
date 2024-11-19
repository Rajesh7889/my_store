import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatContextProvider";
import axios from "axios";
import UserListItem from "../userUnitComps/UserListItem";
import UserBadgeItem from "../userUnitComps/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
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
        `/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds!",
        status: "warning",
        duriation: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedUsers.length < 2) {
       toast({
         title: "There must be more than 2 members in a Group!",
         status: "warning",
         duriation: 5000,
         isClosable: true,
         position: "top",
       });
      return
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
        setChats([data, ...chats])
        onClose()
         toast({
           title: "New Group Chat Created!",
           status: "success",
           duriation: 5000,
           isClosable: true,
           position: "bottom",
         });
    } catch (err) {
         toast({
           title: "Failed to Create the Chat!",
           status: "error",
           duriation: 5000,
           isClosable: true,
           position: "bottom",
         });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already Added!",
        status: "warning",
        duriation: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delusr) => {
    setSelectedUsers((selectedUsers) =>
      selectedUsers.filter((usr) => usr._id !== delusr._id)
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers?.map((usr) => (
                <UserBadgeItem
                  key={usr._id}
                  user={usr}
                  handleFunction={() => handleDelete(usr)}
                />
              ))}
            </Box>

            {loading ? (
              <Spinner ml="auto" display={"flex"} />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
