import { Router } from "express";
import {
  addGoal,
  getGoalsByUserId,
  removeGoalsFromUser,
  removeGoalsById
} from "../controllers/goals.controller";

const router = Router();

router.get("/:userId", (req, res) => getGoalsByUserId(req, res));
router.post("/:userId/add", (req, res) => addGoal(req, res));

//router.delete("/:userId/delete/:goalsName", (req, res) => removeGoalsFromUser(req, res));
router.delete("/:userId/delete/:goalId", (req, res) => removeGoalsById(req, res));

export default router;
