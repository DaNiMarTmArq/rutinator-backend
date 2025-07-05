import { InterestNotFoundError, UserNotFoundError } from "../errors/errors";
import {
  createInterestForUser,
  getAllInterestsByUser,
  getInterestByNameForUser,
  getInterestById,
  removeInterestById,
  updateInterestByIdModel,
  userHasInterestsModel
} from "../models/interest.model";
import {
  Interest,
  InterestDetails,
} from "../models/interfaces/interest.interfaces";
import { findById } from "../models/user.model";
import { capitalizeWords } from "../utils/capitalize";

export async function addInterest(
  interestDetails: InterestDetails
): Promise<Interest> {
  const { userId, interestName, color } = interestDetails;

  const userIdNumber = Number(userId);
  const interestUpper = capitalizeWords(interestName);

  const id = await createInterestForUser(interestUpper, userIdNumber, color);
  let interest = {
    id,
    users_id: userIdNumber,
    interest_name: interestUpper,
    color,
  };

  return interest;
}

export async function getById(interestId: number): Promise<Interest |null> {
  return await getInterestById(interestId);
}

export async function getByUserId(userId: string): Promise<Interest[]> {
  const user = await findById(parseInt(userId));
  if (!user) {
    throw new UserNotFoundError();
  }
  return await getAllInterestsByUser(userId);
}

export async function deleteInterestFromUser(
  userId: string,
  interestName: string
) {
  const interest = await getInterestByNameForUser(interestName, Number(userId));
  if (!interest) throw new InterestNotFoundError();

  await removeInterestById(interest.id);
}

export async function updateInterestById(
  interestId: string,
  interestName: string,
  color: string
) {
  const updatedInterest = await updateInterestByIdModel(Number(interestId), interestName, color);
  return updatedInterest;
}

export async function userHasInterests(
  userId: number
): Promise<boolean>  {
  return await userHasInterestsModel(userId);
}