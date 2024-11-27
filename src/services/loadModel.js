// Memuat konfigurasi dari file .env
require("dotenv").config();

// Mengimpor axios untuk melakukan request HTTP
const axios = require("axios");
const fs = require("fs");

// Mengambil URL model dari file .env
const modelUrl = process.env.MODEL_URL;

// Fungsi untuk mengunduh model dari URL dan menyimpannya
async function loadModel() {
  try {
    // Mengambil data model dari URL yang disimpan di .env
    const response = await axios.get(modelUrl, { responseType: "arraybuffer" });

    // Mendapatkan data model
    const modelData = response.data;

    // Menyimpan data model ke dalam file lokal (opsional)
    fs.writeFileSync("model.json", modelData);
    console.log("Model berhasil diunduh dan disimpan.");

    // Kembalikan modelData untuk digunakan dalam aplikasi
    return modelData;
  } catch (error) {
    console.error("Gagal mengunduh model:", error);
    throw error;
  }
}

// Ekspor fungsi loadModel
module.exports = { loadModel };
