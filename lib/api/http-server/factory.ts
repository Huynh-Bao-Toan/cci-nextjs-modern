import {
  HttpServerError,
  type CreateHttpServerOptions,
  type HttpResponseType,
  type HttpServer,
  type HttpServerErrorCode,
  type HttpServerRequestConfig,
  type SearchParams,
} from "./types";

// ─── Search params ────────────────────────────────────────────────────────────

function buildURLSearchParams(raw: SearchParams): URLSearchParams {
  if (raw instanceof URLSearchParams) return raw;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  return params;
}

// ─── URL builder ──────────────────────────────────────────────────────────────

function buildURL(baseURL: string, path: string, searchParams?: SearchParams): URL {
  // Normalise base + path so double slashes or missing slashes don't matter.
  const base = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
  const relative = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(relative, base);

  if (searchParams) {
    const params = buildURLSearchParams(searchParams);
    params.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  return url;
}

// ─── Error normalisation ──────────────────────────────────────────────────────

function normalizeHttpServerError(
  error: unknown,
  meta?: { method?: string; url?: string },
): HttpServerError {
  if (error instanceof HttpServerError) return error;

  if (error instanceof DOMException && error.name === "AbortError") {
    return new HttpServerError({
      message: "Request was cancelled",
      code: "CANCELLED",
      details: { ...meta, originalError: error },
    });
  }

  if (error instanceof Error) {
    const isTimeout =
      error.name === "TimeoutError" || error.message.toLowerCase().includes("timeout");

    const code: HttpServerErrorCode = isTimeout ? "TIMEOUT" : "NETWORK";
    const fallback = isTimeout
      ? "Request timed out. Please try again."
      : "Network error. Please check your connection.";

    return new HttpServerError({
      message: error.message || fallback,
      code,
      details: { ...meta, originalError: error },
    });
  }

  return new HttpServerError({
    message: "Unexpected error. Please try again.",
    code: "UNKNOWN",
    details: { ...meta, originalError: error },
  });
}

// ─── Response parsing ─────────────────────────────────────────────────────────

async function parseResponse<TResponse>(
  response: Response,
  responseType: HttpResponseType = "json",
  meta?: { method?: string; url?: string },
): Promise<TResponse> {
  const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
  const isJsonContentType =
    contentType.includes("application/json") ||
    contentType.includes("+json") ||
    // some APIs return vendor json without +json; keep this conservative but helpful
    contentType.includes("json");

  switch (responseType) {
    case "text":
      return (await response.text()) as TResponse;
    case "blob":
      return (await response.blob()) as TResponse;
    case "json":
    default:
      if (!isJsonContentType) {
        throw new HttpServerError({
          message: `Expected JSON response but received content-type "${contentType || "unknown"}"`,
          status: response.status,
          code: "SERVER",
          details: { ...meta, status: response.status },
        });
      }

      return (await response.json()) as TResponse;
  }
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as unknown;
      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message?: unknown }).message === "string"
      ) {
        return (data as { message: string }).message;
      }
    }
  } catch {
    // ignore – fall through to generic message
  }
  return `Request failed with status ${response.status}`;
}

// ─── Dev logging ──────────────────────────────────────────────────────────────

function shouldEnableDevLogs(enableDevLogs?: boolean): boolean {
  if (typeof enableDevLogs === "boolean") return enableDevLogs;
  return process.env.NODE_ENV === "development";
}

function logRequest(method: string, url: string, startedAt: number) {
  const timestamp = new Date(startedAt).toISOString();
  console.debug(`[HTTP-SERVER][${timestamp}] -> ${method} ${url}`);
}

function logResponse(
  method: string,
  url: string,
  status: number,
  startedAt: number,
  isError: boolean,
) {
  const endedAt = Date.now();
  const ms = endedAt - startedAt;
  const timestamp = new Date(endedAt).toISOString();
  const arrow = isError ? "xx" : "<-";
  console.debug(`[HTTP-SERVER][${timestamp}] ${arrow} ${method} ${url} ${status} ${ms}ms`);
}

// ─── Abort signal ─────────────────────────────────────────────────────────────

function resolveSignal(config: HttpServerRequestConfig): AbortSignal | undefined {
  if (config.signal) return config.signal;
  if (config.timeout) return AbortSignal.timeout(config.timeout);
  return undefined;
}

// ─── Default headers ──────────────────────────────────────────────────────────

function buildHeaders(
  defaultHeaders: Record<string, string>,
  overrideHeaders?: Record<string, string>,
): Record<string, string> {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...defaultHeaders,
    ...overrideHeaders,
  };
}

// ─── Body serialisation ───────────────────────────────────────────────────────

function serializeBody(body: unknown): string | FormData | Blob | undefined {
  if (body === undefined || body === null) return undefined;
  if (body instanceof FormData || body instanceof Blob) return body;
  return JSON.stringify(body);
}

function isNoBodyStatus(status: number): boolean {
  return status === 204 || status === 205 || status === 304;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createHttpServer(options: CreateHttpServerOptions): HttpServer {
  const defaultHeaders = options.defaultHeaders ?? {};
  const devLogs = shouldEnableDevLogs(options.enableDevLogs);

  async function request<TResponse = unknown, TBody = unknown>(config: {
    method: string;
    url: string;
    body?: TBody;
  } & HttpServerRequestConfig): Promise<TResponse> {
    const method = config.method.toUpperCase();
    const url = buildURL(options.baseURL, config.url, config.searchParams);
    const urlString = url.toString();
    const startedAt = Date.now();

    const headers = buildHeaders(defaultHeaders, config.headers);
    const signal = resolveSignal(config);
    const body = serializeBody(config.body);

    // If body is FormData, remove Content-Type so browser/fetch sets the boundary.
    if (body instanceof FormData) {
      delete headers["Content-Type"];
    }

    if (devLogs) logRequest(method, urlString, startedAt);

    let response: Response;
    try {
      response = await fetch(urlString, {
        method,
        headers,
        body,
        cache: config.cache,
        next: config.next,
        signal,
      });
    } catch (error) {
      if (devLogs) logResponse(method, urlString, 0, startedAt, true);
      throw normalizeHttpServerError(error, { method, url: urlString });
    }

    if (!response.ok) {
      if (devLogs) logResponse(method, urlString, response.status, startedAt, true);

      const message = await extractErrorMessage(response);
      throw new HttpServerError({
        message,
        status: response.status,
        code: "SERVER",
        details: { method, url: urlString, status: response.status },
      });
    }

    if (devLogs) logResponse(method, urlString, response.status, startedAt, false);

    // Never parse body for HEAD / no-body statuses / explicit empty body.
    // Return undefined cast to TResponse for consistency.
    if (
      method === "HEAD" ||
      isNoBodyStatus(response.status) ||
      response.headers.get("content-length") === "0"
    ) {
      return undefined as TResponse;
    }

    return parseResponse<TResponse>(response, config.responseType, { method, url: urlString });
  }

  function get<TResponse = unknown>(url: string, config?: HttpServerRequestConfig) {
    return request<TResponse>({ method: "GET", url, ...config });
  }

  function post<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpServerRequestConfig,
  ) {
    return request<TResponse, TBody>({ method: "POST", url, body, ...config });
  }

  function put<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpServerRequestConfig,
  ) {
    return request<TResponse, TBody>({ method: "PUT", url, body, ...config });
  }

  function patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpServerRequestConfig,
  ) {
    return request<TResponse, TBody>({ method: "PATCH", url, body, ...config });
  }

  function deleteMethod<TResponse = unknown>(url: string, config?: HttpServerRequestConfig) {
    return request<TResponse>({ method: "DELETE", url, ...config });
  }

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: deleteMethod,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Coerce any caught value into an `HttpServerError`. */
export function toHttpServerError(error: unknown): HttpServerError {
  return normalizeHttpServerError(error);
}
