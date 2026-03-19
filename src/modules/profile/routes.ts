import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as profileController from "./controller";
import { palmUploadUrlRouteSchema, profileRouteSchema } from "./schemas";

const profileRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.post("/profile/palm-upload-url", {
    schema: palmUploadUrlRouteSchema,
    handler: profileController.createPalmUploadUrl,
  });

  fastify.put("/profile", {
    schema: profileRouteSchema,
    handler: profileController.upsertProfile,
  });
};

export default profileRoutes;
