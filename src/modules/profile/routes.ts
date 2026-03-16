import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as profileController from "./controller";
import { profileRouteSchema } from "./schemas";

const profileRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.put("/profile", {
    schema: profileRouteSchema,
    handler: profileController.upsertProfile,
  });
};

export default profileRoutes;
