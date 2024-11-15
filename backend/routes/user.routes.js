import express from "express";
import {
  getJoinedRooms,
  getJoinRequests,
  getPublicRooms,
  getRoomMembers,
  joinPublicRoom,
  leaveRoom,
  sendJoinRequest,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getJoinedRooms", protectRoute, getJoinedRooms);
router.get("/getRoomMembers/:roomId", protectRoute, getRoomMembers);
router.get("/getPublicRooms", getPublicRooms);
router.put("/join-public-room/:roomId", protectRoute, joinPublicRoom);
router.put("/leave-room/:roomId", protectRoute, leaveRoom);
router.put("/send-request/:roomId", protectRoute, sendJoinRequest);
router.get("/getJoinRequests/:roomId", protectRoute, getJoinRequests);
export default router;
