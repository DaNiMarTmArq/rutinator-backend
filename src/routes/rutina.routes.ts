import { Router } from "express";
import {
  getRutinasByUser,
  addRutina,
  modRutina,
  getRutinasId,
  generateRoutine,
} from "../controllers/rutina.controller";

const router = Router();

router.put("/", modRutina);
router.post("/", addRutina);
router.get('/user/:userId', getRutinasByUser);
router.get('/:id', getRutinasId);
router.get('/version/:id', getRutinaVersion);
router.get("/generate/:userId", generateRoutine);


export default router;
