// ─── Error ────────────────────────────────────────────────────────────────────

export type HttpServerErrorCode =
  | "NETWORK"
  | "TIMEOUT"
  | "CANCELLED"
  | "SERVER"
  | "UNKNOWN";

export type HttpServerErrorDetails = {
  method?: string;
  url?: string;
  status?: number;
  responseData?: unknown;
  originalError?: unknown;
};

export class HttpServerError extends Error {
  readonly status: number;
  readonly code: HttpServerErrorCode;
  readonly details?: HttpServerErrorDetails;

  constructor(params: {
    message: string;
    status?: number;
    code: HttpServerErrorCode;
    details?: HttpServerErrorDetails;
  }) {
    super(params.message);
    this.name = "HttpServerError";
    this.status = params.status ?? 0;
    this.code = params.code;
    this.details = params.details;
  }
}

// ─── Request config ───────────────────────────────────────────────────────────

/**
 * Optional search params appended to the URL.
 * Accepts either a `URLSearchParams` instance or a plain record.
 * `undefined` values in the record are ignored.
 */
export type SearchParams =
  | URLSearchParams
  | Record<string, string | number | boolean | undefined | null>;

/**
 * Expected response format.
 * - `"json"` (default) – parses body with `response.json()`
 * - `"text"` – returns raw text via `response.text()`
 * - `"blob"` – returns a `Blob` via `response.blob()`
 */
export type HttpResponseType = "json" | "text" | "blob";

/**
 * Cache policy helpers for Next.js `fetch`.
 * `mode` maps to `fetch(..., { cache })`.
 * `revalidate` and `tags` map to `fetch(..., { next })`.
 */
export type HttpServerCacheOptions = {
  mode?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
};

/** Config accepted by every HTTP method on `HttpServer`. */
export type HttpServerRequestConfig = {
  /** Query string params to append to the URL. */
  searchParams?: SearchParams;
  /** Override per-request `Content-Type` / auth / etc. */
  headers?: Record<string, string>;
  /**
   * `RequestCache` value forwarded to fetch.
   * Use `"no-store"` for dynamic data, `"force-cache"` for static.
   */
  cache?: RequestCache;
  /**
   * Next.js–specific fetch extension for ISR and tag-based revalidation.
   * @see https://nextjs.org/docs/app/api-reference/functions/fetch
   */
  next?: NextFetchRequestConfig;
  /**
   * Optional cache helper to avoid repeating raw `cache` + `next` wiring.
   * Useful for request-level cache policies (revalidate/tags).
   */
  cacheOptions?: HttpServerCacheOptions;
  /** Abort signal for request cancellation. */
  signal?: AbortSignal;
  /**
   * Per-request timeout in milliseconds.
   * Creates an internal `AbortSignal.timeout()` when no `signal` is provided.
   */
  timeout?: number;
  /** Response body format. Defaults to `"json"`. */
  responseType?: HttpResponseType;
};

/** Config for mutation methods (POST / PUT / PATCH) – adds an optional body. */
export type HttpServerMutationConfig<TBody = unknown> = HttpServerRequestConfig & {
  body?: TBody;
};

// ─── Factory options ──────────────────────────────────────────────────────────

export type CreateHttpServerOptions = {
  /** Base URL prepended to every relative path. */
  baseURL: string;
  /** Headers merged with the per-request defaults on every request. */
  defaultHeaders?: Record<string, string>;
  /**
   * Enable request/response dev logging.
   * Defaults to `true` in `development`, `false` otherwise.
   */
  enableDevLogs?: boolean;
};

// ─── HttpServer interface ─────────────────────────────────────────────────────

export type HttpServer = {
  /** Generic escape-hatch – send any method with a unified config object. */
  request<TResponse = unknown, TBody = unknown>(config: {
    method: string;
    url: string;
    body?: TBody;
  } & HttpServerRequestConfig): Promise<TResponse>;

  /** HTTP GET */
  get<TResponse = unknown>(
    url: string,
    config?: HttpServerRequestConfig,
  ): Promise<TResponse>;

  /** HTTP POST */
  post<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpServerRequestConfig,
  ): Promise<TResponse>;

  /** HTTP PUT */
  put<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpServerRequestConfig,
  ): Promise<TResponse>;

  /** HTTP PATCH */
  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpServerRequestConfig,
  ): Promise<TResponse>;

  /** HTTP DELETE */
  delete<TResponse = unknown>(
    url: string,
    config?: HttpServerRequestConfig,
  ): Promise<TResponse>;
};
