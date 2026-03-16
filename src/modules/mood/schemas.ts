import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";

const moodLogBodySchema = {
  type: "object",
  properties: {
    mood: { type: "string", minLength: 1 },
    notes: { type: "string", maxLength: 2000 },
    loggedAt: { type: "string", format: "date-time" },
  },
  required: ["mood"],
} as const;

export const moodLogListRouteSchema: FastifySchema = {
  tags: ["Mood"],
  summary: "List mood logs",
  security: bearerSecurity,
  response: {
    200: successEnvelope({
      type: "array",
      items: looseObjectSchema,
    }),
    401: errorResponseSchema,
  },
};

export const moodLogCreateRouteSchema: FastifySchema = {
  tags: ["Mood"],
  summary: "Create mood log",
  security: bearerSecurity,
  body: moodLogBodySchema,
  response: {
    201: successEnvelope(looseObjectSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};
