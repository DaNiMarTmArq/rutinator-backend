// src/routes/user.routes.ts
import { Router } from "express";
import {
  login,
  register,
  getByUsername,
  updateByUsername,
  updateImageByUsername,
} from "../controllers/user.controller";
import { validateRequest } from "../validators/validate.util";
import {
  UserLoginRequestSchema,
  UserRegisterRequestSchema,
} from "../validators/users.validators";
import { authenticateToken } from "../middleware/auth.middleware";
const multer = require("multer");
const upload = multer();

const router = Router();

router.post("/login", validateRequest(UserLoginRequestSchema), login);
router.post("/register", validateRequest(UserRegisterRequestSchema), register);

router.get("/username/:username", authenticateToken, getByUsername);

router.put("/update/username/:username", authenticateToken, updateByUsername);
router.put(
  "/updateImage/username/:username",
  authenticateToken,
  upload.single("image"),
  updateImageByUsername
);

export default router;
