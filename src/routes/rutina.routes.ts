import { Router } from "express";
import { getRutinasByUser, addRutina } from "../controllers/rutina.controller";

const router = Router();

// router.post("/", (req, res) => addRutina(req, res));
router.post("/", addRutina);
router.get('/user/:userId', getRutinasByUser); 

export default router;
