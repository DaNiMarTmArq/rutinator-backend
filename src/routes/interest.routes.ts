import { Router } from "express";
import {
  addInterest,
  getInterestsByUserId,
  removeInterestFromUser,
  updateInterestById
} from "../controllers/interest.controller";

const router = Router();

router.get("/:userId", (req, res) => getInterestsByUserId(req, res));
router.post("/:userId/add", (req, res) => addInterest(req, res));
router.patch("/:userId/update/:interestId", (req, res) => updateInterestById(req, res));
router.delete("/:userId/delete/:interestName", (req, res) =>
  removeInterestFromUser(req, res)
);

export default router;
