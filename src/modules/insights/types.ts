import { Prisma } from "@prisma/client";

export type MulankReadingPayload = {
  insights: Prisma.InputJsonValue;
  mulankAnalysis: Prisma.InputJsonValue;
  luckyElements: Prisma.InputJsonValue;
};

export type DailyPredictionPayload = {
  energy: number;
  predictions: Prisma.InputJsonValue;
  tomorrowPreview?: string;
};
