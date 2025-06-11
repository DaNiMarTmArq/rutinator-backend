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
const multer = require("multer");
const upload = multer();

const router = Router();

router.get("/username/:username", getByUsername);

router.post("/login", validateRequest(UserLoginRequestSchema), login);
router.post("/register", validateRequest(UserRegisterRequestSchema), register);

router.put("/update/username/:username", updateByUsername);
router.put("/updateImage/username/:username", upload.single("image"), updateImageByUsername);

export default router;
