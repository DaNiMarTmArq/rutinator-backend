import { Request, Response } from "express";
import {
  addAvailabilityForUser,
  getSchedulesByUser,
  modifyAvailability,
} from "../services/availability.service";
import { HttpStatus } from "../errors/http.errors";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
} from "../models/interfaces/availability.interfaces";

export async function getSchedulesByUserId(req: Request, res: Response) {
  const { userId } = req.params;

  const schedules = await getSchedulesByUser(userId);
  res.status(HttpStatus.OK).json(schedules);
}

export async function createAvailability(req: Request, res: Response) {
  const { weekday, start_time, end_time } = req.body;
  const { userId } = req.params;

  const data: CreateAvailabilityRequest = {
    weekday,
    start_time,
    end_time,
    user_id: parseInt(userId),
  };

  const newId = await addAvailabilityForUser(data);
  res.status(HttpStatus.CREATED).json({ id: newId });
}

export async function updateAvailability(req: Request, res: Response) {
  const { userId, avalabilityId } = req.params;

  const updateRequest: UpdateAvailabilityRequest = {
    ...req.body,
    user_id: userId,
  };

  await modifyAvailability(parseInt(avalabilityId), updateRequest);
  res.status(HttpStatus.OK).send();
  return;
}
