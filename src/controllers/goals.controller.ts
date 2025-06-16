import { Request, Response } from "express";
import * as goalsService from "../services/goals.service";
import { HttpStatus } from "../errors/http.errors";
import { capitalizeWords } from "../utils/capitalize";


export async function getGoalsByUserId(req: Request, res: Response) {
  const goals = await goalsService.getByUserId(req.params.userId);
  res.status(HttpStatus.OK).json(goals);
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