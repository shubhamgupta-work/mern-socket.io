import { Router } from "express";
import * as userController from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router
  .route("/")
  .post(userController.registerUser)
  .get(protect, userController.allUsers);
router.post("/login", userController.authUser);

export default router;
