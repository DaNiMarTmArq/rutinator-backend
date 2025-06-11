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
  deleteAvailabilityById,
} from "../models/availability.model";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  UserAvailability,
} from "../models/interfaces/availability.interfaces";
import { findById } from "../models/user.model";
import { checkUserExists } from "../utils/checks";

export async function getSchedulesByUser(
  userId: string
): Promise<UserAvailability[]> {
  const user = parseInt(userId);
  await checkUserExists(user);

  return await findAllByUserId(user);
}

export async function addAvailabilityForUser(
  data: CreateAvailabilityRequest
): Promise<number> {
  await checkUserExists(data.user_id);

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
  if (!(await checkUserExists(updates.user_id))) return;

  await checkAvailabilityExistsById(availabilityId, updates.user_id);

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

export async function deleteById(userId: number, availabilityId: number) {
  if (!(await checkUserExists(userId))) return;
  await checkAvailabilityExistsById(availabilityId, userId);
  await deleteAvailabilityById(availabilityId);
}

async function checkAvailabilityExistsById(
  availabilityId: number,
  userId: number
) {
  const exists = await existsAvailabilityById(availabilityId, userId);
  if (!exists) {
    throw new AvailabilityNotFoundError();
  }
}
