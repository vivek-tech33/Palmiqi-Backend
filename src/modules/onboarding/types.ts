import { PersonalizationOption } from "../profile/types";

export type CompleteOnboardingPayload = {
  birthDate: string;
  timeOfBirth?: string | null;
  placeOfBirth: string;
  personalizationOn: PersonalizationOption[];
  palmImageUrl?: string | null;
  language?: string;
};
