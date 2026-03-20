import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as onboardingController from "./controller";
import { completeOnboardingRouteSchema } from "./schemas";

const onboardingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.post("/onboarding/complete", {
    schema: completeOnboardingRouteSchema,
    handler: onboardingController.completeOnboarding,
  });
};

export default onboardingRoutes;
