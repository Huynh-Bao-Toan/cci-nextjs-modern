import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  CanceledError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  AppApiError,
  type AppApiErrorCode,
  type CreateHttpClientOptions,
  type HttpClient,
  type HttpClientRequestConfig,
  type HttpRequestConfig,
} from "./types";

type RequestMeta = {
  startedAt: number;
};

type RequestConfigWithMeta = InternalAxiosRequestConfig & {
  _meta?: RequestMeta;
};

function normalizeAppApiError(error: unknown): AppApiError {
  if (error instanceof AppApiError) return error;

  if (error instanceof CanceledError) {
    return new AppApiError({
      message: error.message || "Request cancelled",
      code: "CANCELLED",
      details: { originalError: error },
    });
  }

  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<unknown>;
    const isTimeout =
      ax.code === "ECONNABORTED" || ax.message.toLowerCase().includes("timeout");
    const hasResponse = !!ax.response;
    const code: AppApiErrorCode = isTimeout
      ? "TIMEOUT"
      : hasResponse
        ? "SERVER"
        : "NETWORK";

    const fallbackMessageByCode: Record<AppApiErrorCode, string> = {
      NETWORK: "Network error. Please check your connection.",
      TIMEOUT: "Request timed out. Please try again.",
      CANCELLED: "Request cancelled.",
      SERVER: "Server error. Please try again.",
      UNKNOWN: "Unexpected error. Please try again.",
    };

    const messageFromData =
      typeof ax.response?.data === "object" &&
      ax.response?.data !== null &&
      "message" in ax.response.data &&
      typeof (ax.response.data as { message?: unknown }).message === "string"
        ? (ax.response.data as { message: string }).message
        : undefined;

    return new AppApiError({
      message: messageFromData ?? ax.message ?? fallbackMessageByCode[code],
      status: ax.response?.status ?? 0,
      code,
      details: {
        isAxiosError: true,
        method: ax.config?.method?.toUpperCase(),
        url: ax.config?.url,
        responseData: ax.response?.data,
        originalError: error,
      },
    });
  }

  if (error instanceof Error) {
    return new AppApiError({
      message: error.message || "Unexpected error. Please try again.",
      code: "UNKNOWN",
      details: { originalError: error },
    });
  }

  return new AppApiError({
    message: "Unexpected error. Please try again.",
    code: "UNKNOWN",
    details: { originalError: error },
  });
}

function createDefaultHeaders(extra?: CreateHttpClientOptions["defaultHeaders"]) {
  return {
    Accept: "application/json",
    ...extra,
  };
}

function shouldEnableDevLogs(enableDevLogs?: boolean): boolean {
  if (typeof enableDevLogs === "boolean") return enableDevLogs;
  return process.env.NODE_ENV === "development";
}

function logRequest(config: RequestConfigWithMeta) {
  if (!config._meta) return;

  const method = (config.method ?? "GET").toUpperCase();
  const url = config.baseURL ? `${config.baseURL}${config.url ?? ""}` : config.url;
  const timestamp = new Date(config._meta.startedAt).toISOString();
  console.debug(`[HTTP][${timestamp}] -> ${method} ${url ?? ""}`);
}

function logResponse(
  response: AxiosResponse<unknown>,
  config: RequestConfigWithMeta,
  isError: boolean,
) {
  const endedAt = Date.now();
  const startedAt = config._meta?.startedAt ?? endedAt;
  const ms = endedAt - startedAt;
  const method = (config.method ?? "GET").toUpperCase();
  const url = config.baseURL ? `${config.baseURL}${config.url ?? ""}` : config.url;
  const timestamp = new Date(endedAt).toISOString();
  const arrow = isError ? "xx" : "<-";
  console.debug(
    `[HTTP][${timestamp}] ${arrow} ${method} ${url ?? ""} ${response.status} ${ms}ms`,
  );
}

function toAxiosConfig<TData>(
  config: HttpClientRequestConfig<TData> & { url: string; method: AxiosRequestConfig["method"] },
): AxiosRequestConfig<TData> {
  return {
    method: config.method,
    url: config.url,
    data: config.data,
    params: config.params,
    headers: config.headers,
    signal: config.signal,
    timeout: config.timeout,
    responseType: config.responseType,
    onUploadProgress: config.onUploadProgress,
    onDownloadProgress: config.onDownloadProgress,
  };
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function hasHeader(config: InternalAxiosRequestConfig, name: string): boolean {
  const headers = config.headers as unknown;
  if (headers && typeof headers === "object" && "has" in headers && typeof headers.has === "function") {
    return !!(headers as { has: (key: string) => boolean }).has(name);
  }

  const raw = (config.headers ?? {}) as Record<string, unknown>;
  const target = name.toLowerCase();
  return Object.keys(raw).some((k) => k.toLowerCase() === target);
}

function setHeader(config: InternalAxiosRequestConfig, name: string, value: string) {
  const headers = config.headers as unknown;
  if (headers && typeof headers === "object" && "set" in headers && typeof headers.set === "function") {
    (headers as { set: (key: string, value: string) => void }).set(name, value);
    return;
  }

  config.headers = {
    ...(config.headers ?? {}),
    [name]: value,
  } as AxiosRequestHeaders;
}

function deleteHeader(config: InternalAxiosRequestConfig, name: string) {
  const headers = config.headers as unknown;
  if (
    headers &&
    typeof headers === "object" &&
    "delete" in headers &&
    typeof headers.delete === "function"
  ) {
    (headers as { delete: (key: string) => void }).delete(name);
    return;
  }

  const raw = (config.headers ?? {}) as Record<string, unknown>;
  const target = name.toLowerCase();
  for (const k of Object.keys(raw)) {
    if (k.toLowerCase() === target) delete (raw as Record<string, unknown>)[k];
  }
  config.headers = raw as AxiosRequestHeaders;
}

export function createHttpClient(options: CreateHttpClientOptions): HttpClient {
  const instance: AxiosInstance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 15_000,
    headers: createDefaultHeaders(options.defaultHeaders),
  });

  const devLogs = shouldEnableDevLogs(options.enableDevLogs);

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const nextConfig = config as RequestConfigWithMeta;
    nextConfig._meta = { startedAt: Date.now() };

    // Header policy (per-request):
    // - Do not force Content-Type by default (e.g. GET/no body)
    // - If data is FormData, never set Content-Type (let Axios/browser set boundary)
    // - If data is JSON-like payload, ensure application/json (unless caller overrides)
    const data = (nextConfig as InternalAxiosRequestConfig & { data?: unknown }).data;
    if (isFormData(data)) {
      deleteHeader(nextConfig, "Content-Type");
    } else if (data !== undefined && data !== null) {
      const isJsonLike =
        typeof data === "object" ||
        typeof data === "string" ||
        typeof data === "number" ||
        typeof data === "boolean";

      if (isJsonLike && !hasHeader(nextConfig, "Content-Type")) {
        setHeader(nextConfig, "Content-Type", "application/json");
      }
    }

    const accessToken = await options.getAccessToken?.();
    if (accessToken) {
      if (typeof nextConfig.headers.set === "function") {
        nextConfig.headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        nextConfig.headers = {
          ...(nextConfig.headers ?? {}),
          Authorization: `Bearer ${accessToken}`,
        } as AxiosRequestHeaders;
      }
    }

    if (devLogs) logRequest(nextConfig);
    return nextConfig;
  });

  instance.interceptors.response.use(
    (response) => {
      if (devLogs) logResponse(response, response.config as RequestConfigWithMeta, false);
      return response;
    },
    async (error: unknown) => {
      const normalized = normalizeAppApiError(error);
      const ax = error as AxiosError | undefined;

      if (devLogs && ax?.response && ax.config) {
        logResponse(ax.response, ax.config as RequestConfigWithMeta, true);
      }

      if (normalized.status === 401 || normalized.status === 403) {
        await options.onUnauthorized?.(normalized);
      }

      return Promise.reject(normalized);
    },
  );

  async function request<TResponse = unknown, TData = unknown>(
    config: HttpClientRequestConfig<TData> & { url: string; method: AxiosRequestConfig["method"] },
  ): Promise<TResponse> {
    const response = await instance.request<TResponse, AxiosResponse<TResponse>, TData>(
      toAxiosConfig(config),
    );
    return response.data;
  }

  function get<TResponse = unknown>(url: string, config?: HttpRequestConfig) {
    return request<TResponse>({ method: "GET", url, ...config });
  }

  function post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: HttpRequestConfig,
  ) {
    return request<TResponse, TData>({ method: "POST", url, data, ...config });
  }

  function put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: HttpRequestConfig,
  ) {
    return request<TResponse, TData>({ method: "PUT", url, data, ...config });
  }

  function patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: HttpRequestConfig,
  ) {
    return request<TResponse, TData>({ method: "PATCH", url, data, ...config });
  }

  function deleteMethod<TResponse = unknown>(url: string, config?: HttpRequestConfig) {
    return request<TResponse>({ method: "DELETE", url, ...config });
  }

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: deleteMethod,
    raw: {
      request: <TResponse = unknown, TData = unknown>(
        config: HttpClientRequestConfig<TData> & {
          url: string;
          method: AxiosRequestConfig["method"];
        },
      ) => instance.request<TResponse, AxiosResponse<TResponse>, TData>(toAxiosConfig(config)),
    },
  };
}

export function toAppApiError(error: unknown): AppApiError {
  return normalizeAppApiError(error);
}
