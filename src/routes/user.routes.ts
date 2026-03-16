import { FastifyPluginAsync } from "fastify";
import * as userController from "../controllers/user.controller";
import auth from "../middlewares/auth";
import {
  dailyPredictionRouteSchema,
  feedbackRouteSchema,
  meRouteSchema,
  moodLogCreateRouteSchema,
  moodLogListRouteSchema,
  mulankReadingRouteSchema,
  preferenceRouteSchema,
  profileRouteSchema,
} from "./schemas";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", auth);

  fastify.get("/me", {
    schema: meRouteSchema,
    handler: userController.getDashboard,
  });
  fastify.put("/profile", {
    schema: profileRouteSchema,
    handler: userController.upsertProfile,
  });
  fastify.put("/preferences", {
    schema: preferenceRouteSchema,
    handler: userController.upsertPreference,
  });
  fastify.post("/feedback", {
    schema: feedbackRouteSchema,
    handler: userController.createFeedback,
  });
  fastify.put("/readings/mulank", {
    schema: mulankReadingRouteSchema,
    handler: userController.upsertMulankReading,
  });
  fastify.put("/daily-predictions", {
    schema: dailyPredictionRouteSchema,
    handler: userController.upsertDailyPrediction,
  });
  fastify.get("/mood-logs", {
    schema: moodLogListRouteSchema,
    handler: userController.listMoodLogs,
  });
  fastify.post("/mood-logs", {
    schema: moodLogCreateRouteSchema,
    handler: userController.createMoodLog,
  });
};

export default userRoutes;
