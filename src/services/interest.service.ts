import {
  addInterestToUser,
  createInterest,
  getInterestByName,
} from "../models/interest.model";
import {
  Interest,
  InterestDetails,
} from "../models/interfaces/interest.interfaces";

export async function addInterest(
  interestDetails: InterestDetails
): Promise<Interest> {
  const { userId, interestName } = interestDetails;

  const interestUpper = capitalizeWords(interestName);
  console.log(interestUpper);

  let interest = await getInterestByName(interestUpper);
  if (!interest) {
    const interestId = await createInterest(interestUpper);
    interest = { id: interestId, interest_name: interestUpper };
  }

  const insertId = await addInterestToUser(interest.id, userId);
  return interest;
}

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
