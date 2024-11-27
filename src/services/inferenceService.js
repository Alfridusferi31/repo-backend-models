const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const classes = [
      "Melanocytic nevus",
      "Squamous cell carcinoma",
      "Vascular lesion",
    ];

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    let explanation, suggestion;

    if (label === "Melanocytic nevus") {
      explanation =
        "Melanocytic nevus adalah kondisi di mana permukaan kulit memiliki bercak warna yang berasal dari sel-sel melanosit.";
      suggestion =
        "Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar.";
    } else if (label === "Squamous cell carcinoma") {
      explanation =
        "Squamous cell carcinoma adalah jenis kanker kulit yang umum dijumpai, sering tumbuh pada bagian tubuh yang sering terkena sinar UV.";
      suggestion =
        "Segera konsultasi dengan dokter terdekat untuk meminimalisasi penyebaran kanker.";
    } else if (label === "Vascular lesion") {
      explanation =
        "Vascular lesion adalah kanker atau tumor pada bagian kepala dan leher.";
      suggestion =
        "Segera konsultasi dengan dokter terdekat untuk mengetahui tingkat bahaya penyakit.";
    }

    return { confidenceScore, label, explanation, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
