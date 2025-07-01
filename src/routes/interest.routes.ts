import { Router } from "express";
import {
  addInterest,
  getInterestsByUserId,
  getInterestsById,
  hasInterests,
  removeInterestFromUser,
  updateInterestById
} from "../controllers/interest.controller";

const router = Router();

router.get("/:userId", (req, res) => getInterestsByUserId(req, res));
router.get("/get/:interestId", (req, res) => getInterestsById(req, res));
router.get("/userHasInterests/:userId", (req, res) => hasInterests(req, res));
router.post("/:userId/add", (req, res) => addInterest(req, res));
router.patch("/:userId/update/:interestId", (req, res) => updateInterestById(req, res));
router.delete("/:userId/delete/:interestName", (req, res) =>
  removeInterestFromUser(req, res)
);

export default router;
