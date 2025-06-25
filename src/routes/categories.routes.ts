import { Router } from "express";
import { getCategoriesController } from "../controllers/categories.controller";

const router = Router();

router.get("/getAllCategories", getCategoriesController);

export default router;
