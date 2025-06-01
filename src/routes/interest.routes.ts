import { Router } from "express";
import { addInterest } from "../controllers/interest.controller";

const router = Router();

router.post("/add", (req, res) => addInterest(req, res));

export default router;
