import {
  addInterestToUser,
  createInterest,
  getInterestByName,
} from "../models/interest.model";
import { InterestDetails } from "../models/interfaces/interest.interfaces";

export async function addInterest(
  interestDetails: InterestDetails
): Promise<number> {
  const { userId, interestName } = interestDetails;

  let interest = await getInterestByName(interestName);
  if (!interest) {
    const interestId = await createInterest(interestName);
    interest = { id: interestId, interest_name: interestName };
  }

  const insertId = await addInterestToUser(interest.id, userId);
  return insertId;
}
