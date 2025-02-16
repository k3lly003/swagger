import 'module-alias/register';
import app from "./app";
import { env, Logger } from "./config";

const logger = new Logger("Server");
const PORT = env.API_PORT || 3002;
const API_BASE_URL = env.API_BASE_URL

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(
      `API Documentation available at ${env.NODE_ENV === "production"
          ? "https://backend-cbx8.onrender.com/api/docs"
          : `${API_BASE_URL}:${PORT}/api/docs`}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Promise Rejection:", err);
  // In production, we would alert DevOps team

  // Gracefully shutdown the server
  server.close(() => {
    logger.error("Server closed due to unhandled promise rejection");
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception:", err);
  // In production, we would alert DevOps team

  // Gracefully shutdown the server
  server.close(() => {
    logger.error("Server closed due to uncaught exception");
    process.exit(1);
  });
});

// Listen for SIGTERM signal
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
  });
});
