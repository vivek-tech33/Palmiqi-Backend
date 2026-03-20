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
    content: { type: "object", additionalProperties: true },
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    readingDate: { type: "string", format: "date" },
    language: { type: "string", minLength: 2 },
  },
  required: ["content", "readingDate"],
} as const;

const dailyPredictionBodySchema = {
  type: "object",
  properties: {
    energy: { type: "integer", minimum: 0, maximum: 100 },
    predictions: { type: "object", additionalProperties: true },
    tomorrowPreview: { type: "string" },
    predictionDate: { type: "string", format: "date" },
    language: { type: "string", minLength: 2 },
  },
  required: ["energy", "predictions", "predictionDate"],
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
