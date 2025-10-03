import { AuthRequest } from "./authMiddleware";
import { sendResponse } from "../utils/response";
import { Response, NextFunction } from "express";
import pool from "../config/db";

export function checkPermissions(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return sendResponse(res, false, "Not Authenticated", null, 401);
    }
    const adminId = req.admin.adminId;

    const result = await pool.query(
      `SELECT r.id, r.permissions 
       FROM admins a 
       JOIN roles r ON r.id = a.role_id 
       WHERE a.id = $1`,
      [adminId]
    );

    const adminRoleId = result.rows[0]?.id;
    const adminPermissions = result.rows[0]?.permissions || [];

    const roleName = await pool.query(
      `SELECT name 
       FROM roles WHERE id = $1`,
      [adminRoleId]
    );

    req.admin.role = roleName.rows[0]?.name || "USER";
    req.admin.permissions = adminPermissions;

    if (adminPermissions.includes(permission)) {
      return next();
    } else {
      return sendResponse(res, false, "Access Denied", null, 403);
    }
  };
}
