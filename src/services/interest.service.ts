import { UserNotFoundError } from "../errors/errors";
import {
  addInterestToUser,
  createInterest,
  getAllInterestsByUser,
  getInterestByName,
} from "../models/interest.model";
import {
  Interest,
  InterestDetails,
} from "../models/interfaces/interest.interfaces";
import { findById } from "../models/user.model";

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

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getByUserId(userId: string): Promise<Interest[]> {
  const user = await findById(parseInt(userId));
  if (!user) {
    throw new UserNotFoundError();
  }
  return await getAllInterestsByUser(userId);
}
