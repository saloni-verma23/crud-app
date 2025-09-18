import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

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
  admin?: { adminId: number; email: string };
}

export function protectAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response(res, false, "Unauthorized", null, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    if (
      typeof decoded === "object" &&
      "adminId" in decoded &&
      "email" in decoded
    ) {
      req.admin = {
        adminId: (decoded as any).adminId,
        email: (decoded as any).email,
      };
      next();
    } else {
      return response(res, false, "Invalid token payload", null, 401);
    }
  } catch (err) {
    return response(res, false, "Invalid or expired token", null, 401);
  }
}
