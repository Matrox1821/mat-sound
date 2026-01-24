import { HttpStatusCode } from "./httpStatusCode";

export class CustomError extends Error {
  private httpStatusCode: HttpStatusCode;
  private errors: any[];

  constructor({
    msg,
    httpStatusCode,
    errors = [],
  }: {
    msg: string;
    httpStatusCode: HttpStatusCode;
    errors?: any[];
  }) {
    super(msg);
    this.errors = errors;
    this.httpStatusCode = httpStatusCode;
  }

  public get errorData() {
    return {
      message: this.message,
      httpStatusCode: this.httpStatusCode,
      errors: this.errors,
    };
  }
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  errors?: any[];
}
