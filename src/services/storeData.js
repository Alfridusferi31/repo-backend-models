const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

const storeData = async (data) => {
  const collection = firestore.collection("predictions");
  await collection.doc(data.id).set(data);
};

module.exports = storeData;
