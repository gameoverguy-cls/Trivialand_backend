import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.patch("/:id", updateCategory);
router.patch("/:id/toggle-status", toggleCategoryStatus);
router.delete("/:id", deleteCategory);

export default router;
