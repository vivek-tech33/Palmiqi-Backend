import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../../core/errors/apiError";
import * as onboardingService from "./service";
import { CompleteOnboardingPayload } from "./types";

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.userId;
}

export async function completeOnboarding(
  request: FastifyRequest<{
    Body: CompleteOnboardingPayload;
  }>,
  reply: FastifyReply,
) {
  const data = await onboardingService.completeOnboarding(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(200).send({
    success: true,
    message: "Onboarding completed successfully",
    data,
  });
}
