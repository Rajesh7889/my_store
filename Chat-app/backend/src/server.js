const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();
const app = express();
const path=require("node:path")
app.use(express.json());
let PORT = process.env.PORT||5000;

const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoute");
const messageRoutes = require("./routes/messageRoute");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { Socket } = require("socket.io");





app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



//--------Deployment---------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend/build")))
  
  app.get("*", (req, resp) => {
    resp.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  })
} else {
  app.get("/", (req, resp) => {
    resp.send("API is Running!!");
  });
}
  //--------Deployment---------

  app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  await connectDB();
  console.log("server started on PORT : " + PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room :" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => {
    console.log("stoped");
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
