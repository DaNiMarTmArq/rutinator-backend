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
  findActivityByRoutine,
  findMaxVersionRoutine,
} from "../models/activity.model";

import { AppError, UserNotFoundError } from "../errors/errors";
import { HttpStatus } from "../errors/http.errors";
import { RecommendedActivities } from "../utils/openai.client";

//

export async function getActivitiesByRoutine(
  routineId: number
): Promise<Activity[]> {
  if (!routineId || isNaN(routineId)) {
    throw new Error("number inválido");
  }
  const activities = await findActivityByRoutine(routineId);

  if (activities === null || activities === undefined) {
    throw new UserNotFoundError();
  }
  return activities;
}

export async function getActivitiesByRoutineByDefault(
  userId: number
): Promise<Activity[]> {
  if (!userId || isNaN(userId)) {
    throw new Error("userId inválido");
  }
  const activities = await findActivityByRoutineByDefault(userId);

  if (activities === null || activities === undefined) {
    throw new UserNotFoundError();
  }
  return activities;
}

export async function getActivitiesByUserId(
  userId: number
): Promise<Activity[]> {
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

export async function saveRecommendedActivities(
  activities: RecommendedActivities[],
  routines_versions_id: number,
  activity_categories_id: number | null
): Promise<number[]> {
  const insertedIds: number[] = [];

  for (const activity of activities) {
    const id = await createActivity({
      routines_versions_id,
      title: activity.title,
      description: activity.description,
      activity_categories_id: null,
      day_of_week: activity.day_of_week,
      start_time: activity.start_time,
      end_time: activity.end_time,
    });

    insertedIds.push(id);
  }

  return insertedIds;
}
export async function getMaxVersionRoutineService(id_routine: number): Promise<number | null> {
  return await findMaxVersionRoutine(id_routine);
}