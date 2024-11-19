const express = require("express");
const { signup, login, allUsers } = require("../controlers/userControler");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/").get(protect, allUsers);

module.exports = router;
