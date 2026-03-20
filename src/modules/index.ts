import { FastifyPluginAsync } from "fastify";
import authRoutes from "./auth/routes";
import feedbackRoutes from "./feedback/routes";
import identityRoutes from "./identity/routes";
import insightsRoutes from "./insights/routes";
import moodRoutes from "./mood/routes";
import onboardingRoutes from "./onboarding/routes";
import preferencesRoutes from "./preferences/routes";
import profileRoutes from "./profile/routes";

const modules: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authRoutes, { prefix: "/auth" });
  await fastify.register(identityRoutes);
  await fastify.register(profileRoutes);
  await fastify.register(onboardingRoutes);
  await fastify.register(preferencesRoutes);
  await fastify.register(feedbackRoutes);
  await fastify.register(insightsRoutes);
  await fastify.register(moodRoutes);
};

export default modules;
