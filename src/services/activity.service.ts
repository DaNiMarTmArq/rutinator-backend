import {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from "../models/interfaces/activity.interfaces";

import {
  createActivity,
  deleteActivityById,
  findActivityById,
  findActivityByUserNameId,
  findActivitiesByRoutineVersion,
  updateActivityById,
  findActivityByRoutineByDefault,
} from "../models/activity.model";

import { AppError, UserNotFoundError } from "../errors/errors";
import { HttpStatus } from "../errors/http.errors";

//
export async function getActivitiesByRoutineByDefault(userId: number): Promise<Activity[]> {
const activities = await findActivityByRoutineByDefault(userId);

  if (activities === null || activities === undefined) {

    throw new UserNotFoundError();
  }
  return activities;
}

export async function getActivitiesByUserId(userId: number): Promise<Activity[]> {
const activities = await findActivityByUserNameId(userId);

  if (activities === null || activities === undefined) {

    throw new UserNotFoundError();
  }
  return activities;
}
//
export async function getActivitiesByRoutineVersionId(
  routineVersionId: number
): Promise<Activity[]> {
  return await findActivitiesByRoutineVersion(routineVersionId);
}
export async function getActivityById(id: number): Promise<Activity> {
  const activity = await findActivityById(id);
  if (!activity) {
    throw new AppError("Activity not found", HttpStatus.NOT_FOUND);
  }
  return activity;
}

export async function addActivity(
  data: CreateActivityRequest
): Promise<Activity> {
  const insertId = await createActivity(data);
  const created = await findActivityById(insertId);

  if (!created) {
    throw new AppError(
      "Activity could not be created",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return created;
}

export async function modifyActivityById(
  id: number,
  updates: UpdateActivityRequest
): Promise<Activity> {
  const existing = await findActivityById(id);
  if (!existing) {
    throw new AppError("Activity not found", HttpStatus.NOT_FOUND);
  }

  await updateActivityById(id, updates);
  const updated = await findActivityById(id);

  if (!updated) {
    throw new AppError(
      "Error updating activity",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return updated;
}

export async function removeActivityById(id: number): Promise<void> {
  const activity = await findActivityById(id);
  if (!activity) {
    throw new AppError("Activity not found", HttpStatus.NOT_FOUND);
  }

  await deleteActivityById(id);
}
