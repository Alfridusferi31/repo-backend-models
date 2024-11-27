const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  const modelPath =
    "https://storage.googleapis.com/model-ml-server/model-in-prod/model.json"; // Path model
  const model = await tf.loadGraphModel(modelPath);
  return model;
}

module.exports = loadModel;
