import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import env from "../config/env";

export type AuthTokenPayload = {
  userId: string;
  email: string;
};

function getJwtExpiresIn(): SignOptions["expiresIn"] {
  const rawValue = env.JWT_EXPIRES_IN;

  if (/^\d+$/.test(rawValue)) {
    return Number(rawValue);
  }

  return rawValue as SignOptions["expiresIn"];
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: getJwtExpiresIn(),
  });
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & AuthTokenPayload;

  return {
    userId: decoded.userId,
    email: decoded.email,
  };
}
