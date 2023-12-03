const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getGoals,
  createGoal,
  deleteGoal,
  updateGoal,
} = require("../controller/goalController");

router.route("/").get(protect, getGoals).post(protect, createGoal);
router.route("/:id").delete(protect, deleteGoal).put(protect, updateGoal);

module.exports = router;
