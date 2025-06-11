import { Router } from "express";
import {
  addRutina
} from "../controllers/rutina.controller";

const router = Router();

//router.post("/", (req, res) => addRutina(req, res));
router.post("/", addRutina);
export default router;
