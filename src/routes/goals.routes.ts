import { Router } from "express";
import {
//  addGoals,
  getGoalsByUserId,
  removeGoalsFromUser,
} from "../controllers/goals.controller";

const router = Router();

router.get("/:userId", (req, res) => getGoalsByUserId(req, res));
//router.post("/:userId/add", (req, res) => addGoals(req, res));
router.delete("/:userId/delete/:goalsName", (req, res) =>
  removeGoalsFromUser(req, res)
);

export default router;
