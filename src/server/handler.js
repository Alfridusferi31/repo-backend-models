const uuid = require("uuid");
const inferenceService = require("../services/inferenceService");
const storeData = require("../services/storeData");
const InputError = require("../exceptions/InputError");

const predict = async (request, h) => {
  try {
    const { payload } = request;

    // Validate image existence
    if (!payload.image) {
      throw new InputError("Image is required", 400);
    }

    const { file } = payload.image.hapi;

    // Run inference
    const result = await inferenceService(file);

    // Determine response based on prediction
    const id = uuid.v4();
    const createdAt = new Date().toISOString();
    const responseData = {
      id,
      result: result === "Cancer" ? "Cancer" : "Non-cancer",
      suggestion:
        result === "Cancer"
          ? "Segera periksa ke dokter!"
          : "Penyakit kanker tidak terdeteksi.",
      createdAt,
    };

    // Store result in Firestore
    await storeData(responseData);

    return h
      .response({
        status: "success",
        message: "Model is predicted successfully",
        data: responseData,
      })
      .code(200);
  } catch (error) {
    console.error(error);

    // Return error response
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
};

module.exports = { predict };
