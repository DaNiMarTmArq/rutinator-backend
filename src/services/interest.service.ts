import { InterestNotFoundError, UserNotFoundError } from "../errors/errors";
import {
  addInterestToUser,
  createInterest,
  getAllInterestsByUser,
  getInterestByName,
  removeInterestFromUser,
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
  const { userId, interestName } = interestDetails;

  const interestUpper = capitalizeWords(interestName);

  let interest = await getInterestByName(interestUpper);

  if (!interest) {
    const interestId = await createInterest(interestUpper);
    interest = { id: interestId, interest_name: interestUpper };
  }

  await addInterestToUser(interest.id, userId);

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
  const interest = await getInterestByName(interestName);
  if (!interest) throw new InterestNotFoundError();
  await removeInterestFromUser(parseInt(userId), interest.id);
}
