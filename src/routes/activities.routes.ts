import { Router } from "express";
import {
  getActivitiesByRoutineVersion,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller";
import { validateRequest } from "../validators/validate.util";
import {
  CreateActivityRequestSchema,
  UpdateActivityRequestSchema,
} from "../validators/activity.schema";

const router = Router();

router.get("/routine/:routineVersionId", (req, res) =>
  getActivitiesByRoutineVersion(req, res)
);

router.get("/:activityId", (req, res) => getActivity(req, res));

router.post(
  "/create",
  validateRequest(CreateActivityRequestSchema),
  (req, res) => createActivity(req, res)
);

router.patch(
  "/:activityId/update",
  validateRequest(UpdateActivityRequestSchema),
  (req, res) => updateActivity(req, res)
);

router.delete("/:activityId/delete", (req, res) => deleteActivity(req, res));

export default router;
