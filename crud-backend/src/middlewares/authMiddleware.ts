import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { decryptToken } from "../services/cryptoService";
import { roles } from "../config/roles.json";

const response = <T>(
  res: Response,
  success: boolean,
  message: string,
  data: T | null = null,
  status = 200
): void => {
  res.status(status).json({ success, message, data });
};

export interface AuthRequest extends Request {
  // user?: any;
  admin?: {
    adminId: number;
    email: string;
    role: string;
    permissions: string[];
  };
}
export function protectAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return response(res, false, "Unauthorized", null, 401);
    }

    let decryptedToken;
    try {
      decryptedToken = decryptToken(token);
    } catch (err) {
      console.error("Token decryption failed:", err);
      return response(res, false, "Invalid token", null, 401);
    }

    const decoded = verifyToken(decryptedToken);

    if (
      typeof decoded === "object" &&
      "adminId" in decoded &&
      "email" in decoded
    ) {
      req.admin = {
        adminId: decoded.adminId,
        email: decoded.email,
        role: "",
        permissions: [],
      };
      return next();
    } else {
      return response(res, false, "Invalid token payload", null, 401);
    }
  } catch (err) {
    console.error("protectAdmin unexpected error:", err);
    return response(res, false, "Server error", null, 500);
  }
}
