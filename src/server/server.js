require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");
const ClientError = require("../exceptions/ClientError"); // Menambahkan ClientError

(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Memuat model untuk aplikasi
  const model = await loadModel();
  server.app.model = model;

  // Menambahkan route ke server
  server.route(routes);

  // Penanganan error dengan detail lebih
  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    // Penanganan error khusus untuk InputError
    if (response instanceof InputError) {
      // Mengirimkan respon dengan kode status 400 dan pesan error yang jelas
      const newResponse = h.response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi", // Pesan umum untuk pengguna
        details: response.details || null, // Detail tambahan jika ada
      });
      newResponse.code(400);
      return newResponse;
    }

    // Penanganan error khusus untuk ClientError (kesalahan yang dihasilkan oleh klien)
    if (response instanceof ClientError) {
      // Menangani kesalahan yang berkaitan dengan request klien
      const newResponse = h.response({
        status: "fail",
        message: response.message, // Pesan dari ClientError
      });
      newResponse.code(response.statusCode); // Kode status dari ClientError (400)
      return newResponse;
    }

    // Penanganan error Boom (error yang umum dari Hapi)
    if (response.isBoom) {
      // Mendapatkan informasi tentang status dan pesan error dari objek Boom
      const statusCode = response.output.statusCode;
      const errorMessage =
        response.message || "Terjadi kesalahan dalam permintaan";
      const errorDetails =
        response.output.payload.error || "Tidak ada rincian lebih lanjut";

      // Jika aplikasi berada di mode pengembangan, tambahkan stack trace dan informasi lainnya untuk debugging
      let additionalInfo = {};
      if (process.env.NODE_ENV === "development") {
        additionalInfo = {
          stack: response.stack || null, // Stack trace untuk pengembangan
          error: errorMessage,
          details: response.output.payload, // Memberikan rincian lebih lanjut dalam mode dev
        };
      }

      // Menyusun dan mengirimkan respon error dengan status dan pesan yang lebih lengkap
      const newResponse = h.response({
        status: "fail",
        message: errorMessage,
        error: errorDetails,
        ...additionalInfo, // Menambahkan informasi tambahan jika ada
      });

      // Mengatur kode status dari Boom error
      newResponse.code(statusCode);
      return newResponse;
    }

    // Jika tidak ada error, lanjutkan eksekusi
    return h.continue;
  });

  // Menangani error pada socket (clientError)
  server.listener.on("clientError", (err, socket) => {
    if (err instanceof ClientError) {
      console.error("Client Error:", err.message); // Menampilkan error client
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n"); // Mengirimkan response 400 ke client
      socket.end(); // Menutup koneksi
    } else {
      // Jika error bukan ClientError, tangani dengan cara lain
      console.error("Network Error:", err.message);
      socket.destroy(); // Menghancurkan koneksi untuk error lain
    }
  });

  // Memulai server
  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
})();
