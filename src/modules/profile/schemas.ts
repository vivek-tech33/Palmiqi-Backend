import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";

const profileBodySchema = {
  type: "object",
  properties: {
    birthDate: { type: "string", format: "date-time" },
    timeOfBirth: { type: "string" },
    placeOfBirth: { type: "string" },
    palmImageUrl: { type: "string", format: "uri" },
  },
} as const;

export const profileRouteSchema: FastifySchema = {
  tags: ["Profile"],
  summary: "Create or update profile",
  security: bearerSecurity,
  body: profileBodySchema,
  response: {
    200: successEnvelope(looseObjectSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};
