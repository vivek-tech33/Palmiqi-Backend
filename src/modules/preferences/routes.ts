import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as preferencesController from "./controller";
import { preferenceRouteSchema } from "./schemas";

const preferencesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.put("/preferences", {
    schema: preferenceRouteSchema,
    handler: preferencesController.upsertPreference,
  });
};

export default preferencesRoutes;
