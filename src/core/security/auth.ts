import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../errors/apiError";
import { verifyToken } from "./jwt";

export default async function auth(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];

  try {
    request.user = verifyToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}
