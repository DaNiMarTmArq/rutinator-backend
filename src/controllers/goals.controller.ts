import { Request, Response } from "express";
import * as goalsService from "../services/goals.service";
import { HttpStatus } from "../errors/http.errors";
import { capitalizeWords } from "../utils/capitalize";
import { GoalsDetails } from "../models/interfaces/goals.interfaces";


export async function getGoalsByUserId(req: Request, res: Response) {
  const goals = await goalsService.getByUserId(req.params.userId);
  res.status(HttpStatus.OK).json(goals);
}

export async function addGoal(req: Request, res: Response) {
  const goalDetails: GoalsDetails = {
    userId: Number(req.params.userId),
    interestId: req.body.interests_id,
    goalsName: req.body.goals_name,
    goalsDescription: req.body.goals_description,
    hoursPerWeek: req.body.hours_per_week
  };
  const goal = await goalsService.addGoal(goalDetails);
  res.status(HttpStatus.CREATED).json({
    success: true,
    goal,
  });
}

export async function removeGoalsFromUser(req: Request, res: Response) {
  const { userId, goalsName } = req.params;
  const goalsNameUpper = capitalizeWords(goalsName);
  await goalsService.deleteGoalsFromUser(userId, goalsNameUpper);
  res.status(HttpStatus.NO_CONTENT).send();
}

export async function removeGoalsById(req: Request, res: Response) {
  const { userId, goalId } = req.params;
  await goalsService.deleteGoalsById(userId, goalId);
  res.status(HttpStatus.NO_CONTENT).send();
}

export async function updateGoalsById(req: Request, res: Response) {
  const { goalId } = req.params;
  const { users_interests_id, goals_name, description, hours_per_week} = req.body;

  await goalsService.updateGoalsById(Number(goalId), Number(users_interests_id), goals_name, description, Number(hours_per_week));
  res.status(HttpStatus.NO_CONTENT).send();
}