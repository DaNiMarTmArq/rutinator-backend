import { AvailabilityError, UserNotFoundError } from "../errors/errors";
import {
  createAvailability,
  findAllByUserId,
  existsAvailability,
} from "../models/availability.model";
import {
  CreateAvailabilityRequest,
  UserAvailability,
} from "../models/interfaces/availability.interfaces";
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

export async function addAvailabilityForUser(
  data: CreateAvailabilityRequest
): Promise<number> {
  const user = await findById(data.user_id);
  if (!user) {
    throw new UserNotFoundError();
  }

  const exists = await existsAvailability(
    data.user_id,
    data.weekday,
    data.start_time,
    data.end_time
  );

  if (exists) {
    throw new AvailabilityError();
  }

  return await createAvailability(data);
}
