import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as moodController from "./controller";
import {
  moodLogCreateRouteSchema,
  moodLogListRouteSchema,
} from "./schemas";

const moodRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.get("/mood-logs", {
    schema: moodLogListRouteSchema,
    handler: moodController.listMoodLogs,
  });

  fastify.post("/mood-logs", {
    schema: moodLogCreateRouteSchema,
    handler: moodController.createMoodLog,
  });
};

export default moodRoutes;
