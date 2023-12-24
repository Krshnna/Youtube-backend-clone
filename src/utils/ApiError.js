class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went Wrong !!",
    error = [],
    err_stack = ""
  ) {
    super(message),
      (this.message = message),
      (this.statusCode = statusCode),
      (this.error = error),
      (this.success = false),
      (this.data = null);

    if (err_stack) {
      this.err_stack = err_stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default { ApiError };
