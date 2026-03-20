import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../../core/errors/apiError";
import * as moodService from "./service";
import { MoodLogPayload } from "./types";

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.userId;
}

export async function createMoodLog(
  request: FastifyRequest<{
    Body: MoodLogPayload;
  }>,
  reply: FastifyReply,
) {
  const data = await moodService.createMoodLog(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(201).send({
    success: true,
    message: "Mood log created successfully",
    data,
  });
}

export async function listMoodLogs(request: FastifyRequest, reply: FastifyReply) {
  const data = await moodService.listMoodLogs(getAuthenticatedUserId(request));

  return reply.status(200).send({
    success: true,
    data,
  });
}
