import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../../core/errors/apiError";
import * as profileService from "./service";
import { PalmUploadUrlPayload, ProfilePayload } from "./types";

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.userId;
}

export async function upsertProfile(
  request: FastifyRequest<{
    Body: ProfilePayload;
  }>,
  reply: FastifyReply,
) {
  const data = await profileService.upsertProfile(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(200).send({
    success: true,
    message: "Profile saved successfully",
    data,
  });
}

export async function createPalmUploadUrl(
  request: FastifyRequest<{
    Body: PalmUploadUrlPayload;
  }>,
  reply: FastifyReply,
) {
  const data = await profileService.createPalmUploadUrl(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(200).send({
    success: true,
    message: "Palm upload URL created successfully",
    data,
  });
}
