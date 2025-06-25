import { GoalsNotFoundError, UserNotFoundError } from "../errors/errors";
import {
  addGoalsToUser,
  createGoals,
  getAllGoalsByUser,
  getGoalsById,
  getGoalsByName,
  removeGoalsFromUser,
  updateGoalsByIdModel
} from "../models/goals.model";
import { Goals, GoalsDetails } from "../models/interfaces/goals.interfaces";
import { findById } from "../models/user.model";

export async function getByUserId(userId: string): Promise<Goals[]> {
  const user = await findById(parseInt(userId));
  if (!user) {
    throw new UserNotFoundError();
  }
  return await getAllGoalsByUser(userId);
}

export async function addGoal(goalsDetails: GoalsDetails): Promise<Goals> {
  const { userId, interestId, goalsName, goalsDescription, hoursPerWeek } =
    goalsDetails;
  const newGoalId = await addGoalsToUser(
    userId,
    interestId,
    goalsName,
    goalsDescription,
    hoursPerWeek
  );

  const goal = {
    id: newGoalId,
    users_id: userId,
    interests_id: interestId,
    goals_name: goalsName,
    description: goalsDescription,
    hours_per_week: hoursPerWeek,
  };

  return goal;
}

export async function deleteGoalsFromUser(userId: string, goalsName: string) {
  const goals = await getGoalsByName(goalsName);
  if (!goals) throw new GoalsNotFoundError();
  await removeGoalsFromUser(parseInt(userId), goals.id);
}

export async function deleteGoalsById(userId: string, goalsId: string) {
  await removeGoalsFromUser(parseInt(userId), parseInt(goalsId));
}

export async function updateGoalsById(
  goalId: number,
  usersInterestsId: number,
  goals_name: string,
  description: string,
  hoursPerWeek: number
) {
  const updatedInterest = await updateGoalsByIdModel(Number(goalId), usersInterestsId, goals_name, description, Number(hoursPerWeek));
  return updatedInterest;
}

