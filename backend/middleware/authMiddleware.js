const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = AsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get the token
      token = req.headers.authorization.split(" ")[1];
      const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET);

      //Get user from the token

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (e) {
      console.log(e);
      res.status(401);
      throw new Error("Not authorized");
    }
  }
  if (!token) throw new Error("Not authorized, no token");
});

module.exports = { protect };
