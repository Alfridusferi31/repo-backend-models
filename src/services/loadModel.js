// const tf = require("@tensorflow/tfjs-node");
// async function loadModel() {
//   return tf.loadGraphModel(process.env.MODEL_URL);
// }
// module.exports = loadModel;

const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  try {
    // Muat model dari URL
    const model = await tf.loadLayersModel(
      "https://storage.googleapis.com/training-bucket-models/model-in-prod/model.json"
    );
    console.log("Model loaded successfully!");

    // Lakukan inferensi atau langkah lainnya dengan model
    // Contoh: model.predict(input);
  } catch (err) {
    console.error("Error loading model:", err);
  }
}

module.exports = loadModel;
