import { FastifyPluginAsync } from "fastify";
import auth from "../../core/security/auth";
import * as insightsController from "./controller";
import {
  dailyPredictionRouteSchema,
  mulankReadingRouteSchema,
} from "./schemas";

const insightsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.put("/readings/mulank", {
    schema: mulankReadingRouteSchema,
    handler: insightsController.upsertMulankReading,
  });

  fastify.put("/daily-predictions", {
    schema: dailyPredictionRouteSchema,
    handler: insightsController.upsertDailyPrediction,
  });
};

export default insightsRoutes;
