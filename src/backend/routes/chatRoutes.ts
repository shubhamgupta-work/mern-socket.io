import { Router } from "express";
import * as chatController from "../controllers/chatController";

const router = Router();

router
  .route("/")
  .get(chatController.fetchChats)
  .post(chatController.accessChat);
router.post("/group", chatController.createGroupChat);
router.put("/rename", chatController.renameGroup);
router.put("/groupremove", chatController.removeFromGroup);
router.put("/groupadd", chatController.addToGroup);

export default router;
