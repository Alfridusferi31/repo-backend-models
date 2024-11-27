require("dotenv").config(); // Memuat variabel lingkungan
const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
  try {
    // Konfigurasi server
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
      routes: {
        cors: {
          origin: ["*"], // Mengizinkan semua origin (sesuaikan di production)
        },
      },
    });

    // Memuat model machine learning
    const model = await loadModel();
    server.app.model = model; // Menyimpan model untuk digunakan di route handler

    // Mendaftarkan route
    server.route(routes);

    // Middleware untuk menangani error sebelum respons dikirim
    server.ext("onPreResponse", (request, h) => {
      const response = request.response; // Mendapatkan respons dari request

      // Penanganan khusus untuk InputError
      if (response instanceof InputError) {
        return h
          .response({
            status: "fail",
            message:
              response.message ||
              "Terjadi kesalahan dalam melakukan prediksi. Silakan gunakan foto lain.",
          })
          .code(response.statusCode || 400); // Default status 400 jika tidak didefinisikan
      }

      // Penanganan untuk error Boom (misalnya payload terlalu besar)
      if (response.isBoom) {
        const { output } = response; // Mengambil output error
        const errorType = output.payload.error; // Jenis error

        let customMessage = "Terjadi kesalahan pada server."; // Pesan default
        if (errorType === "Payload Too Large") {
          customMessage =
            "Ukuran payload melebihi batas maksimum yang diizinkan.";
        }

        const newResponse = h.response({
          status: "fail",
          message: customMessage,
        });

        newResponse.code(output.statusCode); // Menggunakan status code dari error
        return newResponse;
      }

      // Jika tidak ada error, lanjutkan respons
      return h.continue;
    });

    // Menjalankan server
    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
  } catch (error) {
    // Menangani error saat startup
    console.error("Error starting server:", error);
    process.exit(1); // Keluar dengan kode non-zero untuk menunjukkan kegagalan
  }
})();
