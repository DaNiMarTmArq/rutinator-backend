import { Request, Response } from "express";
import * as availabilityService from "../services/availability.service";
import { HttpStatus } from "../errors/http.errors";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
} from "../models/interfaces/availability.interfaces";

export async function getSchedulesByUserId(req: Request, res: Response) {
  const { userId } = req.params;

  const schedules = await availabilityService.getSchedulesByUser(userId);
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

  const newId = await availabilityService.addAvailabilityForUser(data);
  res.status(HttpStatus.CREATED).json({ id: newId });
}

export async function updateAvailability(req: Request, res: Response) {
  const { userId, avalabilityId } = req.params;

  const updateRequest: UpdateAvailabilityRequest = {
    ...req.body,
    user_id: userId,
  };

  await availabilityService.modifyAvailability(
    parseInt(avalabilityId),
    updateRequest
  );
  res.status(HttpStatus.OK).send({
    success: true,
  });
  return;
}

export async function deleteAvailability(req: Request, res: Response) {
  const { userId, avalabilityId } = req.params;

  await availabilityService.deleteById(
    parseInt(userId),
    parseInt(avalabilityId)
  );

  res.status(HttpStatus.OK).send({
    success: true,
  });
  return;
}
