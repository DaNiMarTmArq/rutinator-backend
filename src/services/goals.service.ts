import { GoalsNotFoundError, UserNotFoundError } from "../errors/errors";
import {
  addGoalsToUser,
  createGoals,
  getAllGoalsByUser,
  getGoalsByName,
  removeGoalsFromUser,
} from "../models/goals.model";
import {
  Goals,
  GoalsDetails,
} from "../models/interfaces/goals.interfaces";
import { findById } from "../models/user.model";
import { capitalizeWords } from "../utils/capitalize";

export async function getByUserId(userId: string): Promise<Goals[]> {
  const user = await findById(parseInt(userId));
  if (!user) {
    throw new UserNotFoundError();
  }
  return await getAllGoalsByUser(userId);
}


export async function deleteGoalsFromUser(
  userId: string,
  goalsName: string
) {
  const goals = await getGoalsByName(goalsName);
  if (!goals) throw new GoalsNotFoundError();
  await removeGoalsFromUser(parseInt(userId), goals.id);
}


export async function deleteGoalsById(
  userId: string,
  goalsId: string
) {
  await removeGoalsFromUser(parseInt(userId), parseInt(goalsId));
}