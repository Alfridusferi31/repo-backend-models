// const tf = require("@tensorflow/tfjs-node");
// async function loadModel() {
//   return tf.loadGraphModel(process.env.MODEL_URL);
// }
// module.exports = loadModel;

const tf = require("@tensorflow/tfjs-node");
require("dotenv").config();

async function loadModel() {
  const modelUrl = process.env.MODEL_URL;
  const model = await tf.loadLayersModel(modelUrl);
  console.log("Model loaded successfully from:", modelUrl);
  return model;
}

module.exports = loadModel;
