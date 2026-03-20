import prisma from "../../core/database/prisma";
import { MoodLogPayload } from "./types";

function getDateOnly(value?: string) {
  const target = value ? new Date(`${value}T00:00:00.000Z`) : new Date();
  return new Date(target.toISOString().split("T")[0] + "T00:00:00.000Z");
}

export async function createMoodLog(userId: string, payload: MoodLogPayload) {
  const loggedDate = getDateOnly(payload.loggedDate);

  return prisma.moodLog.upsert({
    where: {
      userId_loggedDate: {
        userId,
        loggedDate,
      },
    },
    update: {
      mood: payload.mood,
      score: payload.score,
      notes: payload.notes,
      loggedAt: new Date(),
    },
    create: {
      userId,
      mood: payload.mood,
      score: payload.score,
      notes: payload.notes,
      loggedDate,
    },
  });
}

export async function listMoodLogs(userId: string) {
  return prisma.moodLog.findMany({
    where: { userId },
    orderBy: { loggedDate: "desc" },
  });
}
