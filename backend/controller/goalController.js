const AsyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
// @desc Get Goals
// @route GET /api/goals/
// @access Private
const getGoals = AsyncHandler(async (req, res) => {
  const goal = await Goal.find({ user: req.user.id });
  res.json(goal);
});

// @desc Post Goal
// @route POST /api/goals/
// @access Private
const createGoal = AsyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add text field");
  }
  const createGoal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.json({ message: createGoal });
});

// @desc PUT Goals
// @route PUT /api/goals/
// @access Private
const updateGoal = AsyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal does not exist");
  }
  //Check if user exists
  if (!req.user) {
    res.status(401);
    throw new Error("User does not exist");
  }
  //Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedGoal);
});

// @desc Delete Goals
// @route DELETE /api/goals/
// @access Private
const deleteGoal = AsyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal does not exist");
  }
  //Check if user exists
  if (!req.user) {
    res.status(401);
    throw new Error("User does not exist");
  }
  //Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await goal.deleteOne();
  res.json({ id: `${req.params.id}` });
});

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
