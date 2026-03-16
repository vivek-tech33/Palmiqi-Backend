import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as identityController from "./controller";
import { meRouteSchema } from "./schemas";

const identityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.get("/me", {
    schema: meRouteSchema,
    handler: identityController.getDashboard,
  });
};

export default identityRoutes;
