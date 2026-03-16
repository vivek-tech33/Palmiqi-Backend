import prisma from "../../core/database/prisma";
import ApiError from "../../core/errors/apiError";

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
