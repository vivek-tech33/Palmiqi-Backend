import buildApp from "./app";
import env from "./core/config/env";
import prisma from "./core/database/prisma";

async function startServer() {
  try {
    await prisma.$connect();
    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    app.log.info(`Server running on port ${env.PORT}`);
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();
