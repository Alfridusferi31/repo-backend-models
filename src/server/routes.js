const Joi = require("joi"); // For validation
const InferenceService = require("../services/inferenceService"); // Service to process predictions

module.exports = [
  {
    method: "POST",
    path: "/predict",
    options: {
      validate: {
        payload: Joi.object({
          image: Joi.any()
            .required()
            .description("Image file for prediction")
            .meta({ swaggerType: "file" }),
        }).unknown(),
      },
      handler: async (request, h) => {
        try {
          const image = request.payload.image; // Image sent from client
          if (!image) {
            throw new Error("No image provided");
          }

          // Perform inference (prediction) via the service
          const result = await InferenceService.predict(image);

          // If prediction successful, respond with status 201
          return h
            .response({
              status: "success",
              message: "Model is predicted successfully",
              data: {
                id: result.id,
                result: result.prediction,
                suggestion: result.suggestion,
                createdAt: new Date().toISOString(),
              },
            })
            .code(201); // Return HTTP status 201
        } catch (error) {
          console.error("Error in prediction:", error);
          return h
            .response({
              status: "fail",
              message: "Terjadi kesalahan dalam melakukan prediksi",
            })
            .code(400); // Return HTTP status 400 for failure
        }
      },
    },
  },
];
