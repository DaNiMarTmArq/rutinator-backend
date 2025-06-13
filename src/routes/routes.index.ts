// src/routes/index.ts
import { Router } from "express";
import userRoutes from "./user.routes";
import interestRoutes from "./interest.routes";
import rutinaRoutes from "./rutina.routes";
import goalsRoutes from "./goals.routes";
import availabilityRoutes from "./availability.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/interests", interestRoutes);
router.use("/goals", goalsRoutes);
router.use("/rutinas", rutinaRoutes);
router.use("/availability", availabilityRoutes);

export default router;
