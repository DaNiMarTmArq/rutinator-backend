import {
  AvailabilityError,
  AvailabilityNotFoundError,
  UserNotFoundError,
} from "../errors/errors";
import {
  createAvailability,
  findAllByUserId,
  existsAvailability,
  existsAvailabilityById,
  updateAvailabilityById,
} from "../models/availability.model";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
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

export async function modifyAvailability(
  availabilityId: number,
  updates: UpdateAvailabilityRequest
) {
  const user = await findById(updates.user_id);
  if (!user) {
    throw new UserNotFoundError();
  }

  const exists = await existsAvailabilityById(availabilityId, updates.user_id);
  if (!exists) {
    throw new AvailabilityNotFoundError();
  }

  const updateFields = {
    weekday: updates.weekday,
    start_time: updates.start_time,
    end_time: updates.end_time,
    users_id: updates.user_id,
  };

  const filteredUpdates = Object.fromEntries(
    Object.entries(updateFields).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(filteredUpdates).length === 0) {
    throw new Error("No fields provided to update");
  }

  await updateAvailabilityById(availabilityId, filteredUpdates);
}
