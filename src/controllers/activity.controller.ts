import { Request, Response } from "express";
import * as activityService from "../services/activity.service";
import { HttpStatus } from "../errors/http.errors";
import {
  CreateActivityRequest,
  UpdateActivityRequest,
} from "../models/interfaces/activity.interfaces";
//

export async function getActivitiesByUserId(req: Request, res: Response) {
  try {
    const { idusername } = req.params;
    const activities = await activityService.getActivitiesByUserId(parseInt(idusername));
    res.status(HttpStatus.OK).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving activities' });
  }
}

//
export async function getActivitiesByRoutineVersion(
  req: Request,
  res: Response
) {
  const { routineVersionId } = req.params;

  const activities = await activityService.getActivitiesByRoutineVersionId(
    parseInt(routineVersionId)
  );

  res.status(HttpStatus.OK).json(activities);
}

export async function getActivity(req: Request, res: Response) {
  const { activityId } = req.params;

  const activity = await activityService.getActivityById(parseInt(activityId));
  res.status(HttpStatus.OK).json(activity);
}

export async function createActivity(req: Request, res: Response) {
  const {
    routines_versions_id,
    title,
    description,
    activity_categories_id,
    day_of_week,
    start_time,
    end_time,
  } = req.body;

  const newActivity: CreateActivityRequest = {
    routines_versions_id,
    title,
    description,
    activity_categories_id,
    day_of_week,
    start_time,
    end_time,
  };

  const created = await activityService.addActivity(newActivity);
  res.status(HttpStatus.CREATED).json(created);
}

export async function updateActivity(req: Request, res: Response) {
  const { activityId } = req.params;
  const updates: UpdateActivityRequest = req.body;

  const updated = await activityService.modifyActivityById(
    parseInt(activityId),
    updates
  );

  res.status(HttpStatus.OK).json(updated);
}

export async function deleteActivity(req: Request, res: Response) {
  const { activityId } = req.params;

  await activityService.removeActivityById(parseInt(activityId));

  res.status(HttpStatus.OK).send({ success: true });
}
