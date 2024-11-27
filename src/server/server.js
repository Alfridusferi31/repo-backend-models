require("dotenv").config(); // Load environment variables
const Hapi = require("@hapi/hapi");
const routes = require("./routes"); // Load routes from routes.js
const loadModel = require("../services/loadModel"); // Load model from services
const InputError = require("../exceptions/InputError"); // InputError class for custom errors

(async () => {
  try {
    // Initialize the server with basic configurations
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
      routes: {
        cors: {
          origin: ["*"], // Allow all origins for now (consider restrictions in production)
        },
      },
    });

    // Load the model asynchronously
    const model = await loadModel();
    server.app.model = model; // Attach model to server for access in routes

    // Register all routes from routes.js
    server.route(routes);

    // Custom error handling
    server.ext("onPreResponse", function (request, h) {
      const response = request.response;

      // Handle custom InputError
      if (response instanceof InputError) {
        return h
          .response({
            status: "fail",
            message: `${response.message} Silakan gunakan foto lain.`,
          })
          .code(response.statusCode);
      }

      // Handle Boom errors
      if (response.isBoom) {
        return h
          .response({
            status: "fail",
            message: response.message,
          })
          .code(response.output.statusCode);
      }

      return h.continue;
    });

    // Start server
    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit with non-zero code to indicate failure
  }
})();
