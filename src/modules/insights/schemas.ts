import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";

const mulankReadingBodySchema = {
  type: "object",
  properties: {
    insights: { type: "object", additionalProperties: true },
    mulankAnalysis: { type: "object", additionalProperties: true },
    luckyElements: { type: "object", additionalProperties: true },
  },
  required: ["insights", "mulankAnalysis", "luckyElements"],
} as const;

const dailyPredictionBodySchema = {
  type: "object",
  properties: {
    energy: { type: "integer", minimum: 0, maximum: 100 },
    predictions: { type: "object", additionalProperties: true },
    tomorrowPreview: { type: "string" },
  },
  required: ["energy", "predictions"],
} as const;

export const mulankReadingRouteSchema: FastifySchema = {
  tags: ["Insights"],
  summary: "Create or update mulank reading",
  security: bearerSecurity,
  body: mulankReadingBodySchema,
  response: {
    200: successEnvelope(looseObjectSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const dailyPredictionRouteSchema: FastifySchema = {
  tags: ["Insights"],
  summary: "Create or update daily prediction",
  security: bearerSecurity,
  body: dailyPredictionBodySchema,
  response: {
    200: successEnvelope(looseObjectSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};
