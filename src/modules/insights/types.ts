import { Prisma } from "@prisma/client";

export type MulankReadingPayload = {
  content: Prisma.InputJsonValue;
  overallScore?: number;
  readingDate: string;
  language?: string;
};

export type DailyPredictionPayload = {
  energy: number;
  predictions: Prisma.InputJsonValue;
  tomorrowPreview?: string;
  predictionDate: string;
  language?: string;
};
