import { HttpError } from "@/lib/api/http";

type ProductsApiErrorShape = {
  message: string;
  status: number;
};

export class ProductsApiError extends Error {
  readonly status: number;

  constructor({ message, status }: ProductsApiErrorShape) {
    super(message);
    this.name = "ProductsApiError";
    this.status = status;
  }
}

export function toProductsApiError(error: unknown): ProductsApiError {
  if (error instanceof ProductsApiError) return error;

  if (error instanceof HttpError) {
    return new ProductsApiError({
      message: error.message,
      status: error.status,
    });
  }

  return new ProductsApiError({
    message: error instanceof Error ? error.message : "Unknown products API error",
    status: 500,
  });
}
