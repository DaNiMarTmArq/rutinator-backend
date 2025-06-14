// src/routes/index.ts
import { Router } from "express";
import userRoutes from "./user.routes";
import interestRoutes from "./interest.routes";
import rutinaRoutes from "./rutina.routes";
import goalsRoutes from "./goals.routes";
import availabilityRoutes from "./availability.routes";
import { authenticateToken } from "../middleware/auth.middleware";
import activitiesRoutes from "./activities.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/interests", authenticateToken, interestRoutes);
router.use("/goals", authenticateToken, goalsRoutes);
router.use("/rutinas", authenticateToken, rutinaRoutes);
router.use("/availability", authenticateToken, availabilityRoutes);
router.use("/activities", authenticateToken, activitiesRoutes);

export default router;
