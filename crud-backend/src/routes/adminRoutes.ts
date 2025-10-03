import { Router } from "express";
import {
  adminLogin,
  createAdmin,
  fetchMe,
  logoutAdmin,
} from "../controllers/adminController";
import { protectAdmin } from "../middlewares/authMiddleware";
import { checkPermissions } from "../middlewares/rbacCheckMiddleware";

const router = Router();

router.post("/login", adminLogin);
router.post("/create-admin", createAdmin);
router.get("/me", protectAdmin, checkPermissions("read_user"), fetchMe);
router.post("/logout", logoutAdmin);

export default router;
