import ApiError from "../../core/errors/apiError";
import prisma from "../../core/database/prisma";
import { createPresignedUploadUrl } from "../../core/storage/s3";
import { PalmUploadUrlPayload, ProfilePayload } from "./types";

const SUPPORTED_PALM_IMAGE_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

function hasBirthDetails(payload: ProfilePayload) {
  return [
    payload.birthDate,
    payload.timeOfBirth,
    payload.placeOfBirth,
  ].some((value) => value !== undefined);
}

function hasCompleteBirthDetails(payload: ProfilePayload) {
  return Boolean(
    payload.birthDate && payload.timeOfBirth && payload.placeOfBirth,
  );
}

function normalizeBirthDate(birthDate: string): Date {
  const normalizedBirthDate = new Date(`${birthDate}T00:00:00.000Z`);

  if (Number.isNaN(normalizedBirthDate.getTime())) {
    throw new ApiError(400, "birthDate must be a valid date");
  }

  return normalizedBirthDate;
}

function normalizeProfilePayload(payload: ProfilePayload) {
  if (hasBirthDetails(payload) && !hasCompleteBirthDetails(payload)) {
    throw new ApiError(
      400,
      "birthDate, timeOfBirth, and placeOfBirth must be provided together",
    );
  }

  if (payload.personalizationOn) {
    const uniqueSelections = new Set(payload.personalizationOn);

    if (uniqueSelections.size !== payload.personalizationOn.length) {
      throw new ApiError(400, "personalizationOn cannot contain duplicates");
    }
  }

  return {
    ...(payload.birthDate
      ? { birthDate: normalizeBirthDate(payload.birthDate) }
      : {}),
    ...(payload.timeOfBirth ? { timeOfBirth: payload.timeOfBirth } : {}),
    ...(payload.placeOfBirth ? { placeOfBirth: payload.placeOfBirth } : {}),
    ...(payload.palmImageUrl ? { palmImageUrl: payload.palmImageUrl } : {}),
    ...(payload.personalizationOn
      ? { personalizationOn: payload.personalizationOn }
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
