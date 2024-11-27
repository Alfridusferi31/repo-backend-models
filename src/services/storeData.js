const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore();

async function storeData(id, data) {
  const docRef = db.collection("predictions").doc(id);
  await docRef.set(data);
}

module.exports = storeData;
