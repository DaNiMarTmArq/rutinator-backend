import { Router } from "express";
import {
  addInterest,
  getInterestsByUserId,
} from "../controllers/interest.controller";

const router = Router();

router.get("/:userid", (req, res) => getInterestsByUserId(req, res));
router.post("/:userid/add", (req, res) => addInterest(req, res));

export default router;
