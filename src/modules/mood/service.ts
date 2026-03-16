import prisma from "../../core/database/prisma";
import { MoodLogPayload } from "./types";

export async function createMoodLog(userId: string, payload: MoodLogPayload) {
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
