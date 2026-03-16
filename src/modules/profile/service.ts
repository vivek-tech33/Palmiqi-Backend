import prisma from "../../core/database/prisma";
import { ProfilePayload } from "./types";

export async function upsertProfile(userId: string, payload: ProfilePayload) {
  return prisma.profile.upsert({
    where: { userId },
    update: payload,
    create: {
      userId,
      ...payload,
    },
  });
}
