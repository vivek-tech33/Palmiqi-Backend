import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../../core/errors/apiError";
import * as feedbackService from "./service";
import { FeedbackPayload } from "./types";

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.userId;
}

export async function createFeedback(
  request: FastifyRequest<{
    Body: FeedbackPayload;
  }>,
  reply: FastifyReply,
) {
  const data = await feedbackService.createFeedback(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(201).send({
    success: true,
    message: "Feedback submitted successfully",
    data,
  });
}
