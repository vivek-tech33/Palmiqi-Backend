import { FastifyReply, FastifyRequest } from "fastify";
import * as userService from "../services/user.service";
import { Prisma } from "@prisma/client";

type ProfileBody = {
  birthDate?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  palmImageUrl?: string;
};

type PreferenceBody = {
  language?: string;
  pushEnabled?: boolean;
  lastClearCache?: string;
};

type MulankReadingBody = {
  insights: Prisma.InputJsonValue;
  mulankAnalysis: Prisma.InputJsonValue;
  luckyElements: Prisma.InputJsonValue;
};

type DailyPredictionBody = {
  energy: number;
  predictions: Prisma.InputJsonValue;
  tomorrowPreview?: string;
};

type FeedbackBody = {
  rating: number;
  comment?: string;
};

type MoodLogBody = {
  mood: string;
  notes?: string;
  loggedAt?: string;
};

function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user) {
    throw new Error("Authenticated user is missing from request");
  }

  return request.user.userId;
}

export async function getDashboard(request: FastifyRequest, reply: FastifyReply) {
  const data = await userService.getDashboard(getAuthenticatedUserId(request));

  return reply.status(200).send({
    success: true,
    data,
  });
}

export async function upsertProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await userService.upsertProfile(
    getAuthenticatedUserId(request),
    request.body as ProfileBody,
  );

  return reply.status(200).send({
    success: true,
    message: "Profile saved successfully",
    data,
  });
}

export async function upsertPreference(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await userService.upsertPreference(
    getAuthenticatedUserId(request),
    request.body as PreferenceBody,
  );

  return reply.status(200).send({
    success: true,
    message: "Preferences saved successfully",
    data,
  });
}

export async function upsertMulankReading(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await userService.upsertMulankReading(
    getAuthenticatedUserId(request),
    request.body as MulankReadingBody,
  );

  return reply.status(200).send({
    success: true,
    message: "Mulank reading saved successfully",
    data,
  });
}

export async function upsertDailyPrediction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await userService.upsertDailyPrediction(
    getAuthenticatedUserId(request),
    request.body as DailyPredictionBody,
  );

  return reply.status(200).send({
    success: true,
    message: "Daily prediction saved successfully",
    data,
  });
}

export async function createFeedback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await userService.createFeedback(
    getAuthenticatedUserId(request),
    request.body as FeedbackBody,
  );

  return reply.status(201).send({
    success: true,
    message: "Feedback submitted successfully",
    data,
  });
}

export async function createMoodLog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await userService.createMoodLog(
    getAuthenticatedUserId(request),
    request.body as MoodLogBody,
  );

  return reply.status(201).send({
    success: true,
    message: "Mood log created successfully",
    data,
  });
}

export async function listMoodLogs(request: FastifyRequest, reply: FastifyReply) {
  const data = await userService.listMoodLogs(getAuthenticatedUserId(request));

  return reply.status(200).send({
    success: true,
    data,
  });
}
