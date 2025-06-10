import { Request, Response } from "express";
import { getSchedulesByUser } from "../services/availability.service";
import { HttpStatus } from "../errors/http.errors";

export async function getSchedulesByUserId(
  request: Request,
  response: Response
) {
  const { userId } = request.params;

  const schedules = await getSchedulesByUser(userId);
  response.status(HttpStatus.OK).json(schedules);
}
