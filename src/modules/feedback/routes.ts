import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as feedbackController from "./controller";
import { feedbackRouteSchema } from "./schemas";

const feedbackRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.post("/feedback", {
    schema: feedbackRouteSchema,
    handler: feedbackController.createFeedback,
  });
};

export default feedbackRoutes;
