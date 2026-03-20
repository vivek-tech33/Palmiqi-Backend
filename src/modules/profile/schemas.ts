import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";
import { PERSONALIZE_OPTIONS } from "./types";

const profileBodySchema = {
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
    palmImageUrl: {
      anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
    },
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
    onboardingCompleted: { type: "boolean" },
  },
} as const;

const palmUploadRequestBodySchema = {
  type: "object",
  properties: {
    contentType: {
      type: "string",
      enum: ["image/jpeg", "image/png", "image/webp"],
    },
  },
  required: ["contentType"],
} as const;

const palmUploadUrlResponseSchema = {
  type: "object",
  properties: {
    uploadUrl: { type: "string", format: "uri" },
    fileUrl: { type: "string", format: "uri" },
    expiresIn: { type: "integer" },
  },
  required: ["uploadUrl", "fileUrl", "expiresIn"],
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

export const palmUploadUrlRouteSchema: FastifySchema = {
  tags: ["Profile"],
  summary: "Create a presigned upload URL for a palm image",
  security: bearerSecurity,
  body: palmUploadRequestBodySchema,
  response: {
    200: successEnvelope(palmUploadUrlResponseSchema, true),
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};
