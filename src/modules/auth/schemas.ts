import { FastifySchema } from "fastify";
import { errorResponseSchema, successEnvelope } from "../../core/http/schemas";

const authTokenDataSchema = {
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
} as const;

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
