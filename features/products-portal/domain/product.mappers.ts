import type { Product } from "./product.types"
import { productSchema } from "./product.schemas"

export function ensureProduct(value: unknown): Product {
  return productSchema.parse(value)
}

