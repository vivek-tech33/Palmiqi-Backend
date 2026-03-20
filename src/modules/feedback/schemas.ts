import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";

const feedbackBodySchema = {
  type: "object",
  properties: {
    rating: { type: "integer", minimum: 1, maximum: 5 },
    comment: { type: "string", maxLength: 1000 },
  },
  required: ["rating"],
} as const;

export const feedbackRouteSchema: FastifySchema = {
  tags: ["Feedback"],
  summary: "Create feedback entry",
  security: bearerSecurity,
  body: feedbackBodySchema,
  response: {
    201: successEnvelope(looseObjectSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};
