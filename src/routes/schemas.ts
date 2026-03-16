import { FastifySchema } from "fastify";

type JsonSchema = Record<string, unknown>;

const successEnvelope = (
  dataSchema?: JsonSchema,
  includeMessage = false,
): JsonSchema => ({
  type: "object",
  properties: {
    success: { type: "boolean", const: true },
    ...(includeMessage ? { message: { type: "string" } } : {}),
    ...(dataSchema ? { data: dataSchema } : {}),
  },
});

const errorResponseSchema: JsonSchema = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    message: { type: "string" },
  },
};

const authTokenDataSchema: JsonSchema = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string", format: "email" },
        name: { type: "string" },
        emailVerified: { type: "boolean" },
        imageUrl: { anyOf: [{ type: "string" }, { type: "null" }] },
      },
      required: ["id", "email", "name", "emailVerified"],
    },
    token: { type: "string" },
  },
  required: ["user", "token"],
};

export const authRegisterRouteSchema: FastifySchema = {
  tags: ["Auth"],
  summary: "Register a user with email and password",
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 2 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
      language: { type: "string", minLength: 2 },
    },
    required: ["name", "email", "password"],
  },
  response: {
    201: successEnvelope(authTokenDataSchema, true),
    400: errorResponseSchema,
    409: errorResponseSchema,
  },
};

export const authLoginRouteSchema: FastifySchema = {
  tags: ["Auth"],
  summary: "Login with email and password",
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
    required: ["email", "password"],
  },
  response: {
    200: successEnvelope(authTokenDataSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const authGoogleRouteSchema: FastifySchema = {
  tags: ["Auth"],
  summary: "Login or sign up with Google ID token",
  body: {
    type: "object",
    properties: {
      idToken: { type: "string", minLength: 1 },
    },
    required: ["idToken"],
  },
  response: {
    200: successEnvelope(authTokenDataSchema, true),
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
};

const profileBodySchema: JsonSchema = {
  type: "object",
  properties: {
    birthDate: { type: "string", format: "date-time" },
    timeOfBirth: { type: "string" },
    placeOfBirth: { type: "string" },
    palmImageUrl: { type: "string", format: "uri" },
  },
};

const preferenceBodySchema: JsonSchema = {
  type: "object",
  properties: {
    language: { type: "string", minLength: 2 },
    pushEnabled: { type: "boolean" },
    lastClearCache: { type: "string", format: "date-time" },
  },
};

const feedbackBodySchema: JsonSchema = {
  type: "object",
  properties: {
    rating: { type: "integer", minimum: 1, maximum: 5 },
    comment: { type: "string", maxLength: 1000 },
  },
  required: ["rating"],
};

const mulankReadingBodySchema: JsonSchema = {
  type: "object",
  properties: {
    insights: { type: "object", additionalProperties: true },
    mulankAnalysis: { type: "object", additionalProperties: true },
    luckyElements: { type: "object", additionalProperties: true },
  },
  required: ["insights", "mulankAnalysis", "luckyElements"],
};

const dailyPredictionBodySchema: JsonSchema = {
  type: "object",
  properties: {
    energy: { type: "integer", minimum: 0, maximum: 100 },
    predictions: { type: "object", additionalProperties: true },
    tomorrowPreview: { type: "string" },
  },
  required: ["energy", "predictions"],
};

const moodLogBodySchema: JsonSchema = {
  type: "object",
  properties: {
    mood: { type: "string", minLength: 1 },
    notes: { type: "string", maxLength: 2000 },
    loggedAt: { type: "string", format: "date-time" },
  },
  required: ["mood"],
};

const bearerSecurity = [{ bearerAuth: [] }];

export const meRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "Get the authenticated user's dashboard payload",
  security: bearerSecurity,
  response: {
    200: successEnvelope({ type: "object", additionalProperties: true }),
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};

export const profileRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "Create or update profile",
  security: bearerSecurity,
  body: profileBodySchema,
  response: {
    200: successEnvelope({ type: "object", additionalProperties: true }, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const preferenceRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "Create or update preferences",
  security: bearerSecurity,
  body: preferenceBodySchema,
  response: {
    200: successEnvelope({ type: "object", additionalProperties: true }, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const feedbackRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "Create feedback entry",
  security: bearerSecurity,
  body: feedbackBodySchema,
  response: {
    201: successEnvelope({ type: "object", additionalProperties: true }, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const mulankReadingRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "Create or update mulank reading",
  security: bearerSecurity,
  body: mulankReadingBodySchema,
  response: {
    200: successEnvelope({ type: "object", additionalProperties: true }, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const dailyPredictionRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "Create or update daily prediction",
  security: bearerSecurity,
  body: dailyPredictionBodySchema,
  response: {
    200: successEnvelope({ type: "object", additionalProperties: true }, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const moodLogListRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "List mood logs",
  security: bearerSecurity,
  response: {
    200: successEnvelope({
      type: "array",
      items: { type: "object", additionalProperties: true },
    }),
    401: errorResponseSchema,
  },
};

export const moodLogCreateRouteSchema: FastifySchema = {
  tags: ["User"],
  summary: "Create mood log",
  security: bearerSecurity,
  body: moodLogBodySchema,
  response: {
    201: successEnvelope({ type: "object", additionalProperties: true }, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};
