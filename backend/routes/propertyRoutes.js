import express from "express";
import {
  getAllProperties,
  searchProperties,
  getPropertyById,
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/search", searchProperties);
router.get("/:id", getPropertyById);

export default router;