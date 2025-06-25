import { InterestNotFoundError, UserNotFoundError } from "../errors/errors";
import {
  createInterestForUser,
  getAllInterestsByUser,
  getInterestByNameForUser,
  removeInterestById,
  updateInterestByIdModel
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

  let interest = await getInterestByNameForUser(interestUpper, userIdNumber);

  if (!interest) {
    const id = await createInterestForUser(interestUpper, userIdNumber, color);
    interest = {
      id,
      users_id: userIdNumber,
      interest_name: interestUpper,
      color,
    };
  }

  return interest;
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