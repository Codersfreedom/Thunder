import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addModarator,
  createRoom,
  getActiveUsers,
  getRoomById,
  getRoomMembers,
  removeModarator,
} from "../controllers/room.controller.js";

const router = express.Router();

router.post("/create-room", protectRoute, createRoom);
router.put("/add-modarator", protectRoute, addModarator);
router.delete("/remove-modarator", protectRoute, removeModarator);
router.get("/getRoomMembers/:roomId", protectRoute, getRoomMembers);
router.get("/getRoomById/:roomId", protectRoute, getRoomById);
router.post("/getActiveUsers", protectRoute, getActiveUsers);
export default router;
