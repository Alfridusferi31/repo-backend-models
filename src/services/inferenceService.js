const tf = require("@tensorflow/tfjs-node");

async function predict(image) {
  try {
    // Preprocess the image for the model
    const tensor = tf.node.decodeImage(image); // Decode the image file into a tensor
    const resizedImage = tf.image.resizeBilinear(tensor, [224, 224]); // Resize to model's input size
    const normalizedImage = resizedImage.div(tf.scalar(255)); // Normalize image (if needed)

    // Make prediction
    const prediction = await model.predict(normalizedImage.expandDims(0)); // Predict using the model

    // Process the prediction (depending on your model output)
    const result = {
      id: "some-unique-id", // Use a unique identifier (e.g., UUID)
      prediction: prediction.dataSync()[0] > 0.5 ? "Cancer" : "Non-cancer", // Example threshold logic
      suggestion:
        prediction.dataSync()[0] > 0.5
          ? "Segera periksa ke dokter!"
          : "Penyakit kanker tidak terdeteksi.",
    };

    return result;
  } catch (error) {
    console.error("Error during prediction:", error);
    throw new Error("Prediction failed");
  }
}

module.exports = {
  predict,
};
