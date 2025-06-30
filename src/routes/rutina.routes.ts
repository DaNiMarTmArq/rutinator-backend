import { Router } from "express";
import {
  getRutinasByUser,
  addRutina,
  modRutina,
  getRutinasId,
  generateRoutine,
  getRutinaVersion,
  modVersionDefecto,
  getRutinaPdf,
  addRutinaGenerada,
  deleteRutinaId
} from "../controllers/rutina.controller";

const router = Router();

router.put("/", modRutina);
router.post("/", addRutina);
router.delete('/:id', deleteRutinaId);
router.get('/user/:userId', getRutinasByUser);
router.get('/:id', getRutinasId);
router.get('/version/:id/:page', getRutinaVersion);
router.put('/version/:id', modVersionDefecto);
router.post("/generate/add", addRutinaGenerada);
router.get("/generate/:userId", generateRoutine);
router.get("/generatePdf/:rutinaId", getRutinaPdf);

export default router;
