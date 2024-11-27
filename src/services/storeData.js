// src/services/storeData.js
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

// Tentukan path ke file service account key
const serviceAccountKeyPath = path.join(
  __dirname,
  "../../keys/firestore-access-key.json"
);

// Inisialisasi Firestore dengan kredensial service account
const firestore = new Firestore({
  projectId: "submissionmlgc-alfridus", // Ganti dengan ID proyek Anda
  keyFilename: serviceAccountKeyPath, // Path ke file service account key
});

// Fungsi untuk menyimpan data ke Firestore
async function storeData(collection, docId, data) {
  try {
    const docRef = firestore.collection(collection).doc(docId);
    await docRef.set(data);
    console.log("Data berhasil disimpan di Firestore");
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
  }
}

module.exports = { storeData };
