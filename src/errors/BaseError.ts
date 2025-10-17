
export class BaseError<T extends string> extends Error {
  public readonly name: T;
  public readonly message: string;
  public readonly statusCode: number;

  constructor(name: T, message: string, statusCode: number) {
    super(message);

    this.name = name;
    this.message = message;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, BaseError.prototype);
    Error.captureStackTrace(this, this.constructor);

  }
}
