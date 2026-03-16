import { FastifyPluginAsync } from "fastify";
import * as authController from "./controller";
import {
  authGoogleRouteSchema,
  authLoginRouteSchema,
  authRegisterRouteSchema,
} from "./schemas";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/register", {
    schema: authRegisterRouteSchema,
    handler: authController.register,
  });

  fastify.post("/login", {
    schema: authLoginRouteSchema,
    handler: authController.login,
  });

  fastify.post("/google", {
    schema: authGoogleRouteSchema,
    handler: authController.googleLogin,
  });
};

export default authRoutes;
