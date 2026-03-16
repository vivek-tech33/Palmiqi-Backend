import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import routes from "./routes";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";

export default async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, { origin: true });
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Palmiqi Backend API",
        description: "Fastify + Prisma backend API documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Local development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  app.get("/health", async () => ({
    success: true,
    message: "Server is healthy",
  }));

  await app.register(routes, { prefix: "/api" });
  app.setNotFoundHandler(notFound);
  app.setErrorHandler(errorHandler);

  return app;
}
