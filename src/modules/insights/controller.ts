import { FastifyReply, FastifyRequest } from "fastify";
import ApiError from "../../core/errors/apiError";
import * as insightsService from "./service";
import { DailyPredictionPayload, MulankReadingPayload } from "./types";

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.userId;
}

export async function upsertMulankReading(
  request: FastifyRequest<{
    Body: MulankReadingPayload;
  }>,
  reply: FastifyReply,
) {
  const data = await insightsService.upsertMulankReading(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(200).send({
    success: true,
    message: "Mulank reading saved successfully",
    data,
  });
}

export async function upsertDailyPrediction(
  request: FastifyRequest<{
    Body: DailyPredictionPayload;
  }>,
  reply: FastifyReply,
) {
  const data = await insightsService.upsertDailyPrediction(
    getAuthenticatedUserId(request),
    request.body,
  );

  return reply.status(200).send({
    success: true,
    message: "Daily prediction saved successfully",
    data,
  });
}
