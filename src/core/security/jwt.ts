import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import env from "../config/env";

export type AuthTokenPayload = {
  userId: string;
  email: string;
};

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & AuthTokenPayload;

  return {
    userId: decoded.userId,
    email: decoded.email,
  };
}
