import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";

const preferenceBodySchema = {
  type: "object",
  properties: {
    language: { type: "string", minLength: 2 },
    pushEnabled: { type: "boolean" },
    lastClearCache: { type: "string", format: "date-time" },
  },
} as const;

export const preferenceRouteSchema: FastifySchema = {
  tags: ["Preferences"],
  summary: "Create or update preferences",
  security: bearerSecurity,
  body: preferenceBodySchema,
  response: {
    200: successEnvelope(looseObjectSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};
