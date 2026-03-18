import { AppApiError, toAppApiError } from "@/lib/api/http-client/index";

export class ProductsApiError extends AppApiError {
  constructor(error: AppApiError) {
    super({
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    });
    this.name = "ProductsApiError";
  }
}

export function toProductsApiError(error: unknown): ProductsApiError {
  const normalized = toAppApiError(error);
  return new ProductsApiError(normalized);
}
