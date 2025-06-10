import { Router } from "express";
import {
  createAvailability,
  getSchedulesByUserId,
} from "../controllers/availability.controller";
import { validateRequest } from "../validators/validate.util";
import { CreateAvailabilityRequestSchema } from "../validators/availabiliy.schema";

const router = Router();

router.get("/:userId", (req, res) => getSchedulesByUserId(req, res));
router.post(
  "/:userId/add",
  validateRequest(CreateAvailabilityRequestSchema),
  (req, res) => createAvailability(req, res)
);

export default router;
