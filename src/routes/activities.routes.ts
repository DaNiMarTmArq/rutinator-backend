import { Router } from "express";
import {
  getActivitiesByRoutineVersion,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitiesByUserId,
  getActivitiesByRoutineByDefault,
  getActivitiesByRoutine,
  saveGeneratedAtivities,
  getMaxVersionRoutineController,
} from "../controllers/activity.controller";
import { validateRequest } from "../validators/validate.util";
import {
  CreateActivityRequestSchema,
  UpdateActivityRequestSchema,
} from "../validators/activity.schema";

const router = Router();

router.get("/selectActivitiesByRoutine/:routineId", (req, res) => {
  getActivitiesByRoutine(req, res);
});

router.get("/activitiesByRoutine/isDefault/:userId", (req, res) => {
  getActivitiesByRoutineByDefault(req, res);
});

router.get("/activitybyuser/:idusername", (req, res) => {
  getActivitiesByUserId(req, res);
});

router.get("/routine/:routineVersionId", (req, res) =>
  getActivitiesByRoutineVersion(req, res)
);

router.get("/:activityId", (req, res) => getActivity(req, res));


router.get('/:id_routine/max-version', (req, res) => { getMaxVersionRoutineController(req, res)});

router.post(
  "/create",
  validateRequest(CreateActivityRequestSchema),
  (req, res) => createActivity(req, res)
);

router.post("/generated/add/:routineId", (req, res) =>
  saveGeneratedAtivities(req, res)
);

router.patch(
  "/:activityId/update",
  validateRequest(UpdateActivityRequestSchema),
  (req, res) => updateActivity(req, res)
);

router.delete("/:activityId/delete", (req, res) => deleteActivity(req, res));

export default router;
