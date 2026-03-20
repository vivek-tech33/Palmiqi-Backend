import prisma from "../../core/database/prisma";
import ApiError from "../../core/errors/apiError";

type DashboardUser = NonNullable<Awaited<ReturnType<typeof getRawUser>>>;

function toDateString(value: Date | null | undefined) {
  return value ? value.toISOString().split("T")[0] : null;
}

function pickLatestByLanguage<T extends { language: string }>(
  items: T[],
  preferredLanguage: string,
) {
  return (
    items.find((item) => item.language === preferredLanguage) || items[0] || null
  );
}

function mapProfile(profile: DashboardUser["profile"]) {
  if (!profile) {
    return null;
  }

  return {
    birthDate: toDateString(profile.birthDate),
    timeOfBirth: profile.timeOfBirth,
    placeOfBirth: profile.placeOfBirth,
    palmImageUrl: profile.palmImageUrl,
    onboardingCompleted: profile.onboardingCompleted,
    personalizationOn: profile.personalizationOn,
    astroProfile: {
      sunSign: profile.sunSign,
      moonSign: profile.moonSign,
      lagnaSign: profile.lagnaSign,
      mulank: profile.mulank,
      rulingPlanet: profile.rulingPlanet,
      mulankTitle: profile.mulankTitle,
      mulankDescription: profile.mulankDescription,
      mulankPros: profile.mulankPros,
      mulankCons: profile.mulankCons,
    },
  };
}

function mapCredits(credit: DashboardUser["userCredit"]) {
  const totalCredits = credit?.totalCredits ?? 0;
  const usedCredits = credit?.usedCredits ?? 0;

  return {
    totalCredits,
    usedCredits,
    remainingCredits: Math.max(0, totalCredits - usedCredits),
    expiresAt: credit?.expiresAt?.toISOString() ?? null,
  };
}

async function getRawUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      imageUrl: true,
      profile: true,
      preference: true,
      userCredit: true,
      dailyInsights: {
        orderBy: [{ insightDate: "desc" }, { createdAt: "desc" }],
        take: 5,
      },
      dailyPredictions: {
        orderBy: [{ predictionDate: "desc" }, { createdAt: "desc" }],
        take: 5,
      },
      mulankReadings: {
        orderBy: [{ readingDate: "desc" }, { createdAt: "desc" }],
        take: 5,
      },
      moodLogs: {
        orderBy: [{ loggedDate: "desc" }, { createdAt: "desc" }],
        take: 7,
      },
    },
  });
}

export async function buildDashboardPayload(userId: string) {
  const user = await getRawUser(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const preferredLanguage = user.preference?.language || "en";
  const latestInsight = pickLatestByLanguage(user.dailyInsights, preferredLanguage);
  const latestPrediction = pickLatestByLanguage(
    user.dailyPredictions,
    preferredLanguage,
  );
  const latestReading = pickLatestByLanguage(
    user.mulankReadings,
    preferredLanguage,
  );
  const today = new Date().toISOString().split("T")[0];
  const todayMood = user.moodLogs.find(
    (mood) => toDateString(mood.loggedDate) === today,
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      imageUrl: user.imageUrl,
    },
    preference: {
      language: preferredLanguage,
      pushEnabled: user.preference?.pushEnabled ?? true,
    },
    profile: mapProfile(user.profile),
    credits: mapCredits(user.userCredit),
    dashboard: {
      today,
      insight: latestInsight
        ? {
            insightDate: toDateString(latestInsight.insightDate),
            language: latestInsight.language,
            energyLevelMin: latestInsight.energyLevelMin,
            energyLevelMax: latestInsight.energyLevelMax,
            energyMorning: latestInsight.energyMorning,
            energyMidday: latestInsight.energyMidday,
            energyEvening: latestInsight.energyEvening,
            summaryHeadline: latestInsight.summaryHeadline,
            summaryDescription: latestInsight.summaryDescription,
            favorableWindows: latestInsight.favorableWindows,
            dos: latestInsight.dos,
            donts: latestInsight.donts,
            luckyColor: latestInsight.luckyColor,
            luckyColorHex: latestInsight.luckyColorHex,
            luckyNumber: latestInsight.luckyNumber,
            luckyGem: latestInsight.luckyGem,
            luckyElement: latestInsight.luckyElement,
            opportunity: latestInsight.opportunity,
            whyExplanation: latestInsight.whyExplanation,
          }
        : null,
      prediction: latestPrediction
        ? {
            predictionDate: toDateString(latestPrediction.predictionDate),
            language: latestPrediction.language,
            energy: latestPrediction.energy,
            predictions: latestPrediction.predictions,
            tomorrowPreview: latestPrediction.tomorrowPreview,
          }
        : null,
      mulankReading: latestReading
        ? {
            readingDate: toDateString(latestReading.readingDate),
            language: latestReading.language,
            content: latestReading.content,
            overallScore: latestReading.overallScore,
          }
        : null,
      mood: {
        today: todayMood
          ? {
              mood: todayMood.mood,
              score: todayMood.score,
              loggedDate: toDateString(todayMood.loggedDate),
            }
          : null,
        last7Days: user.moodLogs.map((mood) => ({
          mood: mood.mood,
          score: mood.score,
          loggedDate: toDateString(mood.loggedDate),
        })),
      },
    },
  };
}

export async function getDashboard(userId: string) {
  return buildDashboardPayload(userId);
}
