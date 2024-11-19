const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/UserModel");




//getting chat if exist otherwise creating a new chat....
const accessChat = asyncHandler(async (req, resp) => {
  let { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return resp.sendStatus(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    resp.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id,userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      resp.status(200).send(FullChat);
    } catch (err) {
      resp.status(400);
      throw new Error(err.message);
    }
  }
});

//creating Group chat.....
const createGroupChat = asyncHandler(async (req, resp) => {
  if (!req.body.users || !req.body.name) {
    return resp.status(400).send({ message: "Please Fill all the feilds" });
  }

  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return resp
      .status(200)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user._id);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    console.log(fullGroupChat);
    resp.status(200).json(fullGroupChat);
  } catch (err) {
    resp.status(400);
    throw new Error(err.message);
  }
});

//rename group....
const renameGroup = asyncHandler(async (req, resp) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    resp.status(404);
    throw new Error("Chat not Found");
  } else {
    resp.json(updatedChat);
  }
});


//fetching chats....
const fetchChats = asyncHandler(async (req, resp) => {
  try {console.log("reaching")
   const results=await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async(results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        resp.status(200).send(results);
    });
  //  resp.status(200).send(results);
  } catch (err) {
    resp.status(400);
    throw new Error(err.message);
  }
});


//Removing 1  group....
const removeFromGroup = asyncHandler(async (req, resp) => {
  const { chatId, userId } = req.body;
  const removed =await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  
  if (!removed) {
    resp.status(400);
    throw new Error("Chat Not Found")
  } else {
    resp.json(removed)
  }
});


//adding a new member to a Group....
const addToGroup = asyncHandler(async (req, resp) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  
  if (!added) {
    resp.status(404);
    throw new Error("Chat Not Found");
  } else {
    resp.json(added)
  }
});

module.exports = {
  accessChat,
  createGroupChat,
  renameGroup,
  fetchChats,
  removeFromGroup,
  addToGroup,
};
