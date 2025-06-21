import { Router } from "express";
import {
  getRutinasByUser,
  addRutina,
  modRutina,
  getRutinasId,
  generateRoutine,
} from "../controllers/rutina.controller";

const router = Router();

router.post("/", addRutina);
router.get("/user/:userId", getRutinasByUser);
router.get("/:id", getRutinasId);
router.put("/", modRutina);
router.get("/generate/:routineId/:userId", generateRoutine);

export default router;
