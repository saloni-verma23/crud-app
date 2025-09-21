import { Router } from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import { protectAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.use("/users", protectAdmin, userRoutes);
router.use("/admin", adminRoutes);

export default router;
