import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = "3600";

interface JwtPayload {
  adminId: number;
  email: string;
}

export function generateToken(adminId: number, email: string): string {
  const payload: JwtPayload = { adminId, email };

  const expiresInSeconds = parseInt(JWT_EXPIRES_IN, 10);

  const options: SignOptions = {
    expiresIn: isNaN(expiresInSeconds) ? 3600 : expiresInSeconds,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
