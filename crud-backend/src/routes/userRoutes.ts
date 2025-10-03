import express from "express";
import {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { checkPermissions } from "../middlewares/rbacCheckMiddleware";

const router = express.Router();

router.get("/", checkPermissions("read_user"), getUsers);
router.get("/:id", checkPermissions("read_user"), getUserById);
router.post("/", checkPermissions("create_user"), createUser);
router.put("/:id", checkPermissions("update_user"), updateUser);
router.delete("/:id", checkPermissions("delete_user"), deleteUser);

export default router;
