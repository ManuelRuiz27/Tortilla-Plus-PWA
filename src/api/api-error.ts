export type ApiError = {
  statusCode: number;
  error: string;
  message: string;
  details?: unknown;
};

export class HttpError extends Error {
  public statusCode: number;
  public error: string;
  public details?: unknown;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'HttpError';
    this.statusCode = apiError.statusCode;
    this.error = apiError.error;
    this.details = apiError.details;
  }
}
