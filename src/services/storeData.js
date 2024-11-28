const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
require("dotenv").config();

async function storeData(id, data) {
  try {
    const db = new Firestore({
      projectId: "submissionmlgc-alfridus-feri",
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    const predictCollection = db.collection("predictions");
    return predictCollection.doc(id).set(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = storeData;
