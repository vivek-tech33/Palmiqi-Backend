export const PERSONALIZE_OPTIONS = [
  "CAREER_WORK",
  "MONEY_WEALTH",
  "LOVE_RELATIONSHIPS",
  "HEALTH_ENERGY",
  "MENTAL_PEACE",
  "PERSONAL_GROWTH",
  "BUSINESS",
] as const;

export type PersonalizationOption = (typeof PERSONALIZE_OPTIONS)[number];

export type ProfilePayload = {
  birthDate?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  palmImageUrl?: string;
  personalizationOn?: PersonalizationOption[];
};

export type PalmUploadUrlPayload = {
  contentType: string;
};
