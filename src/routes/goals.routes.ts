import { Router } from "express";
import {
  addGoal,
  getGoalsByUserId,
  removeGoalsById,
  updateGoalsById
} from "../controllers/goals.controller";

const router = Router();

router.get("/:userId", (req, res) => getGoalsByUserId(req, res));
router.post("/:userId/add", (req, res) => addGoal(req, res));
router.patch("/:userId/update/:goalId", (req, res) => updateGoalsById(req, res));
router.delete("/:userId/delete/:goalId", (req, res) => removeGoalsById(req, res));

export default router;
