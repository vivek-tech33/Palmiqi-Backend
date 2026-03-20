import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../../core/errors/apiError";
import * as preferencesService from "./service";
import { PreferencePayload } from "./types";

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.userId;
}

export async function upsertPreference(
  request: FastifyRequest<{
    Body: PreferencePayload;
  }>,
  reply: FastifyReply,
) {
  const data = await preferencesService.upsertPreference(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(200).send({
    success: true,
    message: "Preferences saved successfully",
    data,
  });
}
