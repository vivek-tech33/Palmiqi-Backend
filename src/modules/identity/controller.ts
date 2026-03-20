import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../../core/errors/apiError";
import * as identityService from "./service";

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.userId;
}

export async function getDashboard(request: FastifyRequest, reply: FastifyReply) {
  const data = await identityService.getDashboard(getAuthenticatedUserId(request));

  return reply.status(200).send({
    success: true,
    data,
  });
}
