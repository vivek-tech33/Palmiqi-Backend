import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

type ErrorWithStatus = FastifyError & {
  statusCode?: number;
  validation?: unknown;
};

export default function errorHandler(
  err: ErrorWithStatus,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (err.validation) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: err.validation,
    });
  }

  const statusCode = err.statusCode ?? 500;
  const message = err.message || "Internal server error";

  return reply.status(statusCode).send({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
