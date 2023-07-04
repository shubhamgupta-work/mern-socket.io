import { Router } from "express";
import * as messageController from "../controllers/messageController";

const router = Router();

router.post("/", messageController.sendMessage);
router.get("/:chatId", messageController.allMessages);

export default router;
