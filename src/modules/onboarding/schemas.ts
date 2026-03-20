import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";
import { PERSONALIZE_OPTIONS } from "../profile/types";

export const completeOnboardingRouteSchema: FastifySchema = {
  tags: ["Onboarding"],
  summary: "Complete onboarding and generate the initial dashboard payload",
  security: bearerSecurity,
  body: {
    type: "object",
    properties: {
      birthDate: { type: "string", format: "date" },
      timeOfBirth: {
        anyOf: [
          {
            type: "string",
            pattern: "^([01]\\d|2[0-3]):[0-5]\\d$",
          },
          { type: "null" },
        ],
      },
      placeOfBirth: { type: "string", minLength: 1 },
      personalizationOn: {
        type: "array",
        items: {
          type: "string",
          enum: PERSONALIZE_OPTIONS,
        },
        minItems: 1,
        maxItems: 3,
        uniqueItems: true,
      },
      palmImageUrl: {
        anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
      },
      language: { type: "string", minLength: 2 },
    },
    required: ["birthDate", "placeOfBirth", "personalizationOn"],
  },
  response: {
    200: successEnvelope(looseObjectSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};
