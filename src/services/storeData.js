const admin = require("firebase-admin");
require("dotenv").config();

// Inisialisasi Firebase Admin SDK dengan menggunakan variabel dari .env
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Mengganti escape character \n dengan newline
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();

async function storeData(id, data) {
  // Menyimpan data ke Firestore
  const docRef = db.collection("predictions").doc(id);

  try {
    await docRef.set(data);
    console.log(`Document written with ID: ${id}`);
  } catch (error) {
    console.error("Error saving document: ", error);
    throw new Error("Terjadi kesalahan saat menyimpan data ke Firestore");
  }
}

module.exports = storeData;
