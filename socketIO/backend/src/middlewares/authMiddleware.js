const jwt = require('jsonwebtoken')
const User = require("../models/UserModel")
const asyncHandler = require("express-async-handler")


const protect = asyncHandler(async (req, resp, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (err) {
            resp.status(401);
            throw new Error("Not authorized token failed")
        }
    }
})

module.exports={protect}