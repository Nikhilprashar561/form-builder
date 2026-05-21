class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = "Bad request"): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  static conflict(message: string = "Conflict"): ApiError {
    return new ApiError(409, message);
  }

  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Not Found"): ApiError {
    return new ApiError(404, message);
  }

  static validationError(message = "Validation Error"): ApiError {
    return new ApiError(422, message);
  }

  static tooManyRequests(message = "Too Many Requests"): ApiError {
    return new ApiError(429, message);
  }

  static internal(message = "Internal Server Error"): ApiError {
    return new ApiError(500, message);
  }

  static serviceUnavailable(message = "Service Unavailable"): ApiError {
    return new ApiError(503, message);
  }
}

export { ApiError }
