// src/routes/index.ts
import { Router } from "express";
import userRoutes from "./user.routes";
import interestRoutes from "./interest.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/interests", interestRoutes);

export default router;
