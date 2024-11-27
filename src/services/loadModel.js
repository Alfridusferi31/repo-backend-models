const tf = require("@tensorflow/tfjs-node"); // TensorFlow.js for Node.js

async function loadModel() {
  try {
    // Use the environment variable for the model URL
    const model = await tf.loadGraphModel(process.env.MODEL_URL);
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    throw new Error("Model failed to load");
  }
}

module.exports = loadModel;
