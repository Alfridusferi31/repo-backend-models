const handler = require("./handler");

module.exports = [
  {
    method: "POST",
    path: "/predict",
    options: {
      payload: {
        allow: "multipart/form-data",
        parse: true,
        maxBytes: 1000000, // Limit to 1MB
        output: "stream",
      },
    },
    handler: handler.predict,
  },
];
