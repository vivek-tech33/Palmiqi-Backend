import { FastifyReply, FastifyRequest } from "fastify";

export default function notFound(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(404).send({
    success: false,
    message: `Route not found: ${request.method} ${request.url}`,
  });
}
