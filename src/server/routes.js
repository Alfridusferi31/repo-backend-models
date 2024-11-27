const postPredictHandler = require("../server/handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        allow: "multipart/form-data", // Mengizinkan data berupa gambar
        multipart: true,
        maxBytes: 1000000, // Max file size 1MB
      },
    },
  },
];

module.exports = routes;
