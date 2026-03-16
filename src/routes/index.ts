import { FastifyPluginAsync } from "fastify";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const routes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authRoutes, { prefix: "/auth" });
  await fastify.register(userRoutes);
};

export default routes;
