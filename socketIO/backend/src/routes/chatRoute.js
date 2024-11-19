
const express = require("express");
const {
  accessChat,
  createGroupChat,
  renameGroup,
  fetchChats,
  removeFromGroup,
  addToGroup,
} = require("../controlers/chatControler");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/renamegroup").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
