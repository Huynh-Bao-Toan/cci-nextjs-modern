import type { AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from "axios";

export type AppApiErrorCode =
  | "NETWORK"
  | "TIMEOUT"
  | "CANCELLED"
  | "SERVER"
  | "UNKNOWN";

export type AppApiErrorDetails = {
  isAxiosError?: boolean;
  method?: string;
  url?: string;
  requestId?: string;
  originalError?: unknown;
  responseData?: unknown;
};

export class AppApiError extends Error {
  readonly status: number;
  readonly code: AppApiErrorCode;
  readonly details?: AppApiErrorDetails;

  constructor(params: {
    message: string;
    status?: number;
    code: AppApiErrorCode;
    details?: AppApiErrorDetails;
  }) {
    super(params.message);
    this.name = "AppApiError";
    this.status = params.status ?? 0;
    this.code = params.code;
    this.details = params.details;
  }
}

export type AccessTokenProvider =
  | (() => string | undefined | null | Promise<string | undefined | null>)
  | undefined;

export type OnUnauthorizedHandler = (error: AppApiError) => void | Promise<void>;

export type CommonHeaders =
  | RawAxiosRequestHeaders
  | Record<string, string | number | boolean>;

export type CreateHttpClientOptions = {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: CommonHeaders;
  getAccessToken?: AccessTokenProvider;
  onUnauthorized?: OnUnauthorizedHandler;
  enableDevLogs?: boolean;
};

export type HttpRequestConfig = {
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  signal?: AbortSignal;
  timeout?: number;
  responseType?: AxiosRequestConfig["responseType"];
  onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
  onDownloadProgress?: AxiosRequestConfig["onDownloadProgress"];
};

export type HttpClientRequestConfig<TData = unknown> = HttpRequestConfig & {
  data?: TData;
};

export type HttpClient = {
  request<TResponse = unknown, TData = unknown>(
    config: HttpClientRequestConfig<TData> & { url: string; method: AxiosRequestConfig["method"] },
  ): Promise<TResponse>;
  get<TResponse = unknown>(url: string, config?: HttpRequestConfig): Promise<TResponse>;
  post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: HttpRequestConfig,
  ): Promise<TResponse>;
  put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: HttpRequestConfig,
  ): Promise<TResponse>;
  patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: HttpRequestConfig,
  ): Promise<TResponse>;
  delete<TResponse = unknown>(url: string, config?: HttpRequestConfig): Promise<TResponse>;
  raw: {
    request: <TResponse = unknown, TData = unknown>(
      config: HttpClientRequestConfig<TData> & { url: string; method: AxiosRequestConfig["method"] },
    ) => Promise<AxiosResponse<TResponse>>;
  };
};
