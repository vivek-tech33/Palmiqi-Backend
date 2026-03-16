import prisma from "../../core/database/prisma";
import { DailyPredictionPayload, MulankReadingPayload } from "./types";

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
