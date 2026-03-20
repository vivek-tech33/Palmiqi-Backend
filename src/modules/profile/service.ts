import ApiError from "../../core/errors/apiError";
import prisma from "../../core/database/prisma";
import { createPresignedUploadUrl } from "../../core/storage/s3";
import { PalmUploadUrlPayload, ProfilePayload } from "./types";

const SUPPORTED_PALM_IMAGE_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

function normalizeBirthDate(birthDate: string): Date {
  const normalizedBirthDate = new Date(`${birthDate}T00:00:00.000Z`);

  if (Number.isNaN(normalizedBirthDate.getTime())) {
    throw new ApiError(400, "birthDate must be a valid date");
  }

  return normalizedBirthDate;
}

function normalizeProfilePayload(payload: ProfilePayload) {
  if (payload.personalizationOn) {
    const uniqueSelections = new Set(payload.personalizationOn);

    if (uniqueSelections.size !== payload.personalizationOn.length) {
      throw new ApiError(400, "personalizationOn cannot contain duplicates");
    }
  }

  if (payload.birthDate && !payload.placeOfBirth) {
    throw new ApiError(400, "placeOfBirth is required when birthDate is provided");
  }

  if (payload.timeOfBirth && !payload.birthDate) {
    throw new ApiError(400, "birthDate is required when timeOfBirth is provided");
  }

  return {
    ...(payload.birthDate
      ? { birthDate: normalizeBirthDate(payload.birthDate) }
      : {}),
    ...(payload.timeOfBirth !== undefined
      ? { timeOfBirth: payload.timeOfBirth }
      : {}),
    ...(payload.placeOfBirth ? { placeOfBirth: payload.placeOfBirth } : {}),
    ...(payload.palmImageUrl !== undefined
      ? { palmImageUrl: payload.palmImageUrl }
      : {}),
    ...(payload.personalizationOn
      ? { personalizationOn: payload.personalizationOn }
      : {}),
    ...(payload.onboardingCompleted !== undefined
      ? { onboardingCompleted: payload.onboardingCompleted }
      : {}),
  };
}

export async function upsertProfile(userId: string, payload: ProfilePayload) {
  const normalizedPayload = normalizeProfilePayload(payload);

  return prisma.profile.upsert({
    where: { userId },
    update: normalizedPayload,
    create: {
      userId,
      ...normalizedPayload,
    },
  });
}

export async function createPalmUploadUrl(
  userId: string,
  payload: PalmUploadUrlPayload,
) {
  const extension = SUPPORTED_PALM_IMAGE_TYPES.get(payload.contentType);

  if (!extension) {
    throw new ApiError(400, "Unsupported palm image content type");
  }

  const objectKey = `users/${userId}/palm/${Date.now()}${extension}`;

  return createPresignedUploadUrl({
    key: objectKey,
    contentType: payload.contentType,
  });
}
