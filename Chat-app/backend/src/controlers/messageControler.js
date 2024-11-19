const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/UserModel");
const Chat = require("../models/chatModel");
//message sent by users.....
const sendMessage = asyncHandler(async (req, resp) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return resp.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    resp.json(message);
  } catch (err) {
    resp.status(400);
    throw new Error(err.message);
  }
});

// sending all messages to the users....
const allMessages = asyncHandler(async (req, resp) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    resp.json(message);
  } catch (err) {}
});

module.exports = { sendMessage, allMessages };
