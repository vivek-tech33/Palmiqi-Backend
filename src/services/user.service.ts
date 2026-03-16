import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import ApiError from "../utils/apiError";

type ProfilePayload = {
  birthDate?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  palmImageUrl?: string;
};

type PreferencePayload = {
  language?: string;
  pushEnabled?: boolean;
  lastClearCache?: string;
};

type MulankReadingPayload = {
  insights: Prisma.InputJsonValue;
  mulankAnalysis: Prisma.InputJsonValue;
  luckyElements: Prisma.InputJsonValue;
};

type DailyPredictionPayload = {
  energy: number;
  predictions: Prisma.InputJsonValue;
  tomorrowPreview?: string;
};

type FeedbackPayload = {
  rating: number;
  comment?: string;
};

type MoodLogPayload = {
  mood: string;
  notes?: string;
  loggedAt?: string;
};

export async function getDashboard(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      imageUrl: true,
      profile: true,
      preference: true,
      mulankReading: true,
      dailyPrediction: true,
      moodLogs: {
        orderBy: { loggedAt: "desc" },
        take: 10,
      },
      feedbacks: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}

export async function upsertProfile(
  userId: string,
  payload: ProfilePayload,
) {
  return prisma.profile.upsert({
    where: { userId },
    update: payload,
    create: {
      userId,
      ...payload,
    },
  });
}

export async function upsertPreference(
  userId: string,
  payload: PreferencePayload,
) {
  return prisma.preference.upsert({
    where: { userId },
    update: payload,
    create: {
      userId,
      ...payload,
    },
  });
}

export async function upsertMulankReading(
  userId: string,
  payload: MulankReadingPayload,
) {
  return prisma.mulankReading.upsert({
    where: { userId },
    update: {
      insights: payload.insights,
      mulankAnalysis: payload.mulankAnalysis,
      luckyElements: payload.luckyElements,
    },
    create: {
      userId,
      insights: payload.insights,
      mulankAnalysis: payload.mulankAnalysis,
      luckyElements: payload.luckyElements,
    },
  });
}

export async function upsertDailyPrediction(
  userId: string,
  payload: DailyPredictionPayload,
) {
  return prisma.dailyPrediction.upsert({
    where: { userId },
    update: {
      energy: payload.energy,
      predictions: payload.predictions,
      tomorrowPreview: payload.tomorrowPreview,
    },
    create: {
      userId,
      energy: payload.energy,
      predictions: payload.predictions,
      tomorrowPreview: payload.tomorrowPreview,
    },
  });
}

export async function createFeedback(
  userId: string,
  payload: FeedbackPayload,
) {
  return prisma.feedback.create({
    data: {
      userId,
      ...payload,
    },
  });
}

export async function createMoodLog(
  userId: string,
  payload: MoodLogPayload,
) {
  return prisma.moodLog.create({
    data: {
      userId,
      ...payload,
    },
  });
}

export async function listMoodLogs(userId: string) {
  return prisma.moodLog.findMany({
    where: { userId },
    orderBy: { loggedAt: "desc" },
  });
}
