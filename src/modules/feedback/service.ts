import prisma from "../../core/database/prisma";
import { FeedbackPayload } from "./types";

export async function createFeedback(userId: string, payload: FeedbackPayload) {
  return prisma.feedback.create({
    data: {
      userId,
      ...payload,
    },
  });
}
