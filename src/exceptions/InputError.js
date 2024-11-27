class InputError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "InputError";
    this.statusCode = statusCode;
  }
}

module.exports = InputError;
