import { Router } from "express";
import {
  createAvailability,
  deleteAvailability,
  getSchedulesByUserId,
  updateAvailability,
} from "../controllers/availability.controller";
import { validateRequest } from "../validators/validate.util";
import {
  CreateAvailabilityRequestSchema,
  UpdateAvailabilityRequestSchema,
} from "../validators/availabiliy.schema";

const router = Router();

router.get("/:userId", (req, res) => getSchedulesByUserId(req, res));
router.post(
  "/:userId/add",
  validateRequest(CreateAvailabilityRequestSchema),
  (req, res) => createAvailability(req, res)
);
router.patch(
  "/:userId/:avalabilityId/update",
  validateRequest(UpdateAvailabilityRequestSchema),
  (req, res) => updateAvailability(req, res)
);
router.delete("/:userId/:avalabilityId/delete", (req, res) =>
  deleteAvailability(req, res)
);

export default router;
