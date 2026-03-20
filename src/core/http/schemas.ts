type JsonSchema = Record<string, unknown>;

export const successEnvelope = (
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

export const errorResponseSchema: JsonSchema = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    message: { type: "string" },
  },
};

export const looseObjectSchema: JsonSchema = {
  type: "object",
  additionalProperties: true,
};

export const bearerSecurity = [{ bearerAuth: [] }];
