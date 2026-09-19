import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import {
  createPattern,
  deletePatternById,
  getPatternById,
  getPatterns,
  savePatternImage,
  // updatePattern,
  // deletePattern,
  // getPattern,
} from "../controller/patternController.js";
import {
  multerErrorMiddleware,
  multerFileFilter,
} from "../middlewares/errors.js";
import { uploadPostMedia } from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/patterns/save")
  .post(
    isAuthenticatedUser,
    multerErrorMiddleware,
    multerFileFilter,
    uploadPostMedia,
    savePatternImage
  );

// POST /api/v1/patterns → Create new pattern
router.post("/patterns", isAuthenticatedUser, createPattern);

// GET /api/v1/patterns → Get all patterns for the authenticated user
router.get("/patterns", isAuthenticatedUser, getPatterns);

// GET /api/v1/patterns/:id → Get a single pattern by ID
router.get("/patterns/:id", isAuthenticatedUser, getPatternById);

// DELETE /api/v1/patterns/:id → Delete a pattern by ID
router.delete("/patterns/:id", isAuthenticatedUser, deletePatternById);

export default router;
