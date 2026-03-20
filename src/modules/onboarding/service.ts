import prisma from '../../core/database/prisma';
import ApiError from '../../core/errors/apiError';
import { buildDashboardPayload } from '../identity/service';
import { buildOnboardingSeedData } from './seed';
import { CompleteOnboardingPayload } from './types';

function normalizeDateOnly(value: string | Date) {
  const base = typeof value === 'string' ? new Date(`${value}T00:00:00.000Z`) : value;

  if (Number.isNaN(base.getTime())) {
    throw new ApiError(400, 'Invalid date supplied');
  }

  return new Date(`${base.toISOString().split('T')[0]}T00:00:00.000Z`);
}

export async function completeOnboarding(
  userId: string,
  payload: CompleteOnboardingPayload,
) {
  if (!payload.personalizationOn?.length) {
    throw new ApiError(400, 'At least one personalization focus is required');
  }

  const birthDate = normalizeDateOnly(payload.birthDate);
  const today = normalizeDateOnly(new Date());
  const language = payload.language || 'en';
  const seedData = buildOnboardingSeedData(birthDate, payload.personalizationOn);

  await prisma.$transaction(async (tx) => {
    await tx.preference.upsert({
      where: { userId },
      update: {
        language,
      },
      create: {
        userId,
        language,
        pushEnabled: true,
      },
    });

    await tx.profile.upsert({
      where: { userId },
      update: {
        birthDate,
        timeOfBirth: payload.timeOfBirth ?? null,
        placeOfBirth: payload.placeOfBirth,
        palmImageUrl: payload.palmImageUrl ?? null,
        personalizationOn: payload.personalizationOn,
        onboardingCompleted: true,
        sunSign: seedData.astroProfile.sunSign,
        moonSign: seedData.astroProfile.moonSign,
        lagnaSign: seedData.astroProfile.lagnaSign,
        mulank: seedData.astroProfile.mulank,
        rulingPlanet: seedData.astroProfile.rulingPlanet,
        mulankTitle: seedData.astroProfile.mulankTitle,
        mulankDescription: seedData.astroProfile.mulankDescription,
        mulankPros: seedData.astroProfile.mulankPros,
        mulankCons: seedData.astroProfile.mulankCons,
      },
      create: {
        userId,
        birthDate,
        timeOfBirth: payload.timeOfBirth ?? null,
        placeOfBirth: payload.placeOfBirth,
        palmImageUrl: payload.palmImageUrl ?? null,
        personalizationOn: payload.personalizationOn,
        onboardingCompleted: true,
        sunSign: seedData.astroProfile.sunSign,
        moonSign: seedData.astroProfile.moonSign,
        lagnaSign: seedData.astroProfile.lagnaSign,
        mulank: seedData.astroProfile.mulank,
        rulingPlanet: seedData.astroProfile.rulingPlanet,
        mulankTitle: seedData.astroProfile.mulankTitle,
        mulankDescription: seedData.astroProfile.mulankDescription,
        mulankPros: seedData.astroProfile.mulankPros,
        mulankCons: seedData.astroProfile.mulankCons,
      },
    });

    await tx.userCredit.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    await tx.dailyInsight.upsert({
      where: {
        userId_insightDate_language: {
          userId,
          insightDate: today,
          language,
        },
      },
      update: seedData.insight,
      create: {
        userId,
        insightDate: today,
        language,
        ...seedData.insight,
      },
    });

    await tx.dailyPrediction.upsert({
      where: {
        userId_predictionDate_language: {
          userId,
          predictionDate: today,
          language,
        },
      },
      update: seedData.prediction,
      create: {
        userId,
        predictionDate: today,
        language,
        ...seedData.prediction,
      },
    });

    await tx.mulankReading.upsert({
      where: {
        userId_readingDate_language: {
          userId,
          readingDate: today,
          language,
        },
      },
      update: seedData.reading,
      create: {
        userId,
        readingDate: today,
        language,
        ...seedData.reading,
      },
    });
  });

  return buildDashboardPayload(userId);
}
