import { Request, Response } from "express";
import * as activityService from "../services/activity.service";
import { HttpStatus } from "../errors/http.errors";
import {
  CreateActivityRequest,
  UpdateActivityRequest,
} from "../models/interfaces/activity.interfaces";
import { RecommendedActivities } from "../utils/openai.client";
import * as rutinaService from "../services/rutina.service";
//

export async function getActivitiesByRoutine(req: Request, res: Response) {
  try {
    const { routineId } = req.params;
    const activities = await activityService.getActivitiesByRoutine(
      parseInt(routineId)
    );

    // Si no hay actividades, devuelve un array vacío
    if (!activities || activities.length === 0) {
      return res.status(HttpStatus.OK).json([]);
    }

    return res.status(HttpStatus.OK).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving activities" + req.params });
  }
}

export async function getActivitiesByRoutineByDefault(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.params;
    const activities = await activityService.getActivitiesByRoutineByDefault(
      parseInt(userId)
    );

    // Si no hay actividades, devuelve un array vacío
    if (!activities || activities.length === 0) {
      return res.status(HttpStatus.OK).json([]);
    }

    return res.status(HttpStatus.OK).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving activities" });
  }
}

export async function getActivitiesByUserId(req: Request, res: Response) {
  try {
    const { idusername } = req.params;
    const activities = await activityService.getActivitiesByUserId(
      parseInt(idusername)
    );

    // Si no hay actividades, devuelve un array vacío
    if (!activities || activities.length === 0) {
      return res.status(HttpStatus.OK).json([]);
    }

    return res.status(HttpStatus.OK).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving activities" });
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

export async function saveGeneratedAtivities(req: Request, res: Response) {
  const { routineId } = req.params;
  let generatedActivityList = req.body as RecommendedActivities[];

  // 🔁 Mapear días de la semana en español a ENUM '0'-'6'
  const dayMap: Record<string, string> = {
    domingo: "0",
    lunes: "1",
    martes: "2",
    miércoles: "3",
    jueves: "4",
    viernes: "5",
    sábado: "6",
  };

  generatedActivityList = generatedActivityList.map((activity) => ({
    ...activity,
    day_of_week:
      dayMap[activity.day_of_week.toLowerCase()] ?? activity.day_of_week,
  }));

  const routineVersionId = await rutinaService.crearNuevaVersionRutinaService(
    Number(routineId),
    true
  );

  const inserts = await activityService.saveRecommendedActivities(
    generatedActivityList,
    routineVersionId,
    routineVersionId
  );

  if (inserts && inserts.length > 0) {
    res.status(HttpStatus.CREATED).send({
      success: true,
      inserts,
    });
    return;
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    success: false,
  });
  return;
}
