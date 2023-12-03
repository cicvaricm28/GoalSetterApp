const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/userModel");

// @desc Register user
// @route POST /api/users/
// @access Public
const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const createUser = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  if (createUser) {
    res.status(201).json({
      id: createUser.id,
      email: createUser.email,
      name: createUser.name,
      token: generateToken(userExists.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists && (await bcrypt.compare(password, userExists.password))) {
    res.status(200).json({
      id: userExists.id,
      email: userExists.email,
      name: userExists.name,
      token: generateToken(userExists.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const generateToken = (id) => {
  return jsonWebToken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc Get user data
// @route POST /api/users/me
// @access Public
const getMe = AsyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = { registerUser, getMe, loginUser };
