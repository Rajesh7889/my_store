const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../config/generateToken");

exports.signup = asyncHandler(async (req, resp) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    resp.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    resp.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    resp.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    resp.status(400);
    throw new Error("Failed to Create the User");
  }
});

exports.login = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("empty");
    resp.send("");
  }
  if (user && (await user.matchPassword(password))) {
    resp.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    resp.send("");
  }
});

exports.allUsers = asyncHandler(async (req, resp) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  resp.send(users);
});
