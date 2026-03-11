import "server-only";

import { notFound } from "next/navigation";

import { httpGetJson, HttpError } from "@/lib/api/http";

import type { RawProduct } from "../api/products.types";
import { mapRawProduct } from "../api/products.mapper";

export async function getProductById(id: number) {
  try {
    const raw = await httpGetJson<RawProduct>(`/products/${id}`, {
      cache: "force-cache",
    });

    return mapRawProduct(raw);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}

