import { FastifySchema } from "fastify";
import {
  bearerSecurity,
  errorResponseSchema,
  looseObjectSchema,
  successEnvelope,
} from "../../core/http/schemas";

export const meRouteSchema: FastifySchema = {
  tags: ["Identity"],
  summary: "Get the authenticated user's dashboard payload",
  security: bearerSecurity,
  response: {
    200: successEnvelope(looseObjectSchema),
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};
