import { HttpServerError } from "@/lib/api/http-server";

export class ProductsApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor({
    message,
    status,
    code = "UNKNOWN",
  }: {
    message: string;
    status: number;
    code?: string;
  }) {
    super(message);
    this.name = "ProductsApiError";
    this.status = status;
    this.code = code;
  }
}

export function toProductsApiError(error: unknown): ProductsApiError {
  if (error instanceof ProductsApiError) return error;

  if (error instanceof HttpServerError) {
    return new ProductsApiError({
      message: error.message,
      status: error.status,
      code: error.code,
    });
  }

  return new ProductsApiError({
    message: error instanceof Error ? error.message : "Unknown products API error",
    status: 500,
  });
}
