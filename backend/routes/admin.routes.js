import express from "express";
import {
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from "../controllers/admin.controller.js";
import { IsAdmin, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute, IsAdmin);
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);


export default router;
