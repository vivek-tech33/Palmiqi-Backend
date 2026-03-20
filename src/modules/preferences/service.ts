import prisma from "../../core/database/prisma";
import { PreferencePayload } from "./types";

export async function upsertPreference(userId: string, payload: PreferencePayload) {
  return prisma.preference.upsert({
    where: { userId },
    update: payload,
    create: {
      userId,
      ...payload,
    },
  });
}
