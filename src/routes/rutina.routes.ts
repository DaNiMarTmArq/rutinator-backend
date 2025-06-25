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
  sendRutinaByEmail
} from "../controllers/rutina.controller";

const router = Router();

router.put("/", modRutina);
router.post("/", addRutina);
router.get('/user/:userId', getRutinasByUser);
router.get('/:id', getRutinasId);
router.get('/version/:id/:page', getRutinaVersion);
router.put('/version/:id', modVersionDefecto);
router.get("/generate/:userId", generateRoutine);
router.get("/generatePdf/:rutinaId", getRutinaPdf);
router.post("/sendMail/:rutinaId", sendRutinaByEmail);

export default router;
