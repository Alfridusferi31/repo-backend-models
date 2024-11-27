require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
  try {
    // Server configuration
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
      routes: {
        cors: {
          origin: ["*"], // Allow all origins
        },
        payload: {
          maxBytes: 1000000, // Payload size limit: 1MB
        },
      },
    });

    // Load TensorFlow model
    const model = await loadModel();
    server.app.model = model;

    // Register routes
    server.route(routes);

    // Global error handling
    server.ext("onPreResponse", (request, h) => {
      const response = request.response;

      // Handle InputError
      if (response instanceof InputError) {
        return h
          .response({
            status: "fail",
            message: response.message,
          })
          .code(response.statusCode);
      }

      // Handle Payload Too Large (413) or other Boom errors
      if (response.isBoom) {
        const statusCode = response.output.statusCode;
        const message =
          statusCode === 413
            ? "Payload content length greater than maximum allowed: 1000000"
            : response.message;

        return h
          .response({
            status: "fail",
            message,
          })
          .code(statusCode);
      }

      return h.continue;
    });

    // Start server
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
