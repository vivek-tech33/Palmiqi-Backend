import prisma from "../../core/database/prisma";
import { DailyPredictionPayload, MulankReadingPayload } from "./types";

function normalizeDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export async function upsertMulankReading(
  userId: string,
  payload: MulankReadingPayload,
) {
  return prisma.mulankReading.upsert({
    where: {
      userId_readingDate_language: {
        userId,
        readingDate: normalizeDateOnly(payload.readingDate),
        language: payload.language || "en",
      },
    },
    update: {
      content: payload.content,
      overallScore: payload.overallScore,
    },
    create: {
      userId,
      content: payload.content,
      overallScore: payload.overallScore,
      readingDate: normalizeDateOnly(payload.readingDate),
      language: payload.language || "en",
    },
  });
}

export async function upsertDailyPrediction(
  userId: string,
  payload: DailyPredictionPayload,
) {
  return prisma.dailyPrediction.upsert({
    where: {
      userId_predictionDate_language: {
        userId,
        predictionDate: normalizeDateOnly(payload.predictionDate),
        language: payload.language || "en",
      },
    },
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
      predictionDate: normalizeDateOnly(payload.predictionDate),
      language: payload.language || "en",
    },
  });
}
