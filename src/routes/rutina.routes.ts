import { Router } from "express";
import {
  addRutina
} from "../controllers/rutinas.controller";

const router = Router();

router.post("/add", (req, res) => addRutina(req, res));

export default router;
