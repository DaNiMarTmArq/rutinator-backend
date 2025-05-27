// src/routes/user.routes.ts
import { Router } from "express";
import { login, register } from "../controllers/user.controller";
import { validateRequest } from "../validators/validate.util";
import {
  UserLoginRequestSchema,
  UserRegisterRequestSchema,
} from "../validators/users.validators";

const router = Router();

router.post("/login", validateRequest(UserLoginRequestSchema), login);
router.post("/register", validateRequest(UserRegisterRequestSchema), register);

export default router;
