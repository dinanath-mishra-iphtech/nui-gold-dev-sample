export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;

    // Restore prototype chain — required for `instanceof` to work
    // correctly when targeting ES5 or when bundlers transpile classes.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
