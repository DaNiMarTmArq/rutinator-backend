import { UserNotFoundError } from "../errors/errors";
import { findAllByUserId } from "../models/availability.model";
import { UserAvailability } from "../models/interfaces/availability.interfaces";
import { findById } from "../models/user.model";

export async function getSchedulesByUser(
  userId: string
): Promise<UserAvailability[]> {
  const user = await findById(parseInt(userId));
  if (!user) {
    throw new UserNotFoundError();
  }

  return await findAllByUserId(user.id);
}
