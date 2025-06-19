import { Router } from "express";
import { getRutinasByUser, addRutina,modRutina,getRutinasId } from "../controllers/rutina.controller";

const router = Router();

router.post("/", addRutina);
router.get('/user/:userId', getRutinasByUser);
router.get('/:id', getRutinasId);
router.put("/", modRutina);

export default router;
