import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatPage/ChatLoading";
import UserListItem from "../userUnitComps/UserListItem";
import ProfileModel from "../modals/ProfileModal";
import { getSender } from "../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge"

const Header = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    setLoading(true);
    if (!search) {
      toast({
        title: "Please Enter something in Search!",
        status: "warning",
        duriation: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      setLoadingChat(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" textColor={"black"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE } />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              {!notification.length ? (
                <MenuItem>No New Notification</MenuItem>
              ) : (
                notification.map((ntf) => {
                  return (
                    <MenuItem
                      key={ntf._id}
                      onClick={() => {
                        setSelectedChat(ntf.chat);
                        setNotification(notification.filter((n) => n !== ntf));
                      }}
                    >
                      {ntf.chat.isGroupChat
                        ? ntf.chat.chatName
                        : getSender(user, ntf.chat.users)}
                    </MenuItem>
                  );
                })
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" name={user?.name} src={user?.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={() => logoutHandler()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
