const tf = require("@tensorflow/tfjs-node");

const inferenceService = async (file) => {
  const model = tf.loadGraphModel(process.env.MODEL_URL);

  // Preprocess the image
  const imageBuffer = Buffer.from(file._data);
  const decodedImage = tf.node.decodeImage(imageBuffer, 3);
  const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
  const normalizedImage = resizedImage.div(tf.scalar(255)).expandDims();

  // Run inference
  const prediction = model.predict(normalizedImage);
  const predictionResult = prediction.dataSync()[0];

  // Return result based on threshold
  return predictionResult > 0.5 ? "Cancer" : "Non-cancer";
};

module.exports = inferenceService;
