import { GoalsNotFoundError, UserNotFoundError } from "../errors/errors";
import {
  addGoalsToUser,
  createGoals,
  getAllGoalsByUser,
  getGoalsById,
  getGoalsByName,
  removeGoalsFromUser,
} from "../models/goals.model";
import {
  Goals,
  GoalsDetails,
} from "../models/interfaces/goals.interfaces";
import { findById } from "../models/user.model";


export async function getByUserId(userId: string): Promise<Goals[]> {
  const user = await findById(parseInt(userId));
  if (!user) {
    throw new UserNotFoundError();
  }
  return await getAllGoalsByUser(userId);
}


export async function addGoal(
  goalsDetails: GoalsDetails
): Promise<Goals> {
  const { userId, interestId, goalsName, goalsDescription, hoursPerWeek } = goalsDetails;
  console.log(goalsDetails)
  const newGoalId =  await addGoalsToUser(userId, interestId, goalsName, goalsDescription, hoursPerWeek );
  console.log(newGoalId)

  const goal = { 
    id: newGoalId,
    users_id: userId,
    interests_id: interestId,
    goals_name: goalsName,
    goals_description: goalsDescription,
    hours_per_week: hoursPerWeek
  };

  return goal;
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