import { Request, Response } from "express";
import * as goalsService from "../services/goals.service";
import { HttpStatus } from "../errors/http.errors";
import { GoalsDetails } from "../models/interfaces/goals.interfaces";
import { capitalizeWords } from "../utils/capitalize";

/*
export async function addGoals(req: Request, res: Response) {
  const goalsDetails: GoalsDetails = {
    userId: req.params.userId,
    goalsName: req.body.goalsName,
  };
  const goals = await goalsService.addGoals(goalsDetails);
  res.status(HttpStatus.CREATED).json({
    success: true,
    goals,
  });
}
*/

export async function getGoalsByUserId(req: Request, res: Response) {
  const goals = await goalsService.getByUserId(req.params.userId);
  console.log(goals);
  res.status(HttpStatus.OK).json(goals);
}

export async function removeGoalsFromUser(req: Request, res: Response) {
  const { userId, goalsName } = req.params;
  const goalsNameUpper = capitalizeWords(goalsName);
  await goalsService.deleteGoalsFromUser(userId, goalsNameUpper);
  res.status(HttpStatus.NO_CONTENT).send();
}
