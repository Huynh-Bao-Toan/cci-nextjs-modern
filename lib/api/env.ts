const FALLBACK_DUMMYJSON_BASE_URL = "https://dummyjson.com";

export function getDummyJsonBaseUrl() {
  if (typeof process === "undefined") {
    return FALLBACK_DUMMYJSON_BASE_URL;
  }

  const value = process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL;

  return value && value.length > 0 ? value : FALLBACK_DUMMYJSON_BASE_URL;
}

