import { Router } from "express";
import { getSchedulesByUserId } from "../controllers/availability.controller";

const router = Router();

router.get("/:userId", (req, res) => getSchedulesByUserId(req, res));

export default router;
