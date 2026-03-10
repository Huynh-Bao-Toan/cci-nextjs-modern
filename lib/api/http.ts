import { getDummyJsonBaseUrl } from "./env";

type HttpMethod = "GET";

type HttpOptions = {
  /**
   * Additional search params to append to the URL.
   */
  searchParams?: URLSearchParams | Record<string, string | number | boolean | undefined>;
  /**
   * Opt out of Next.js fetch caching for this request.
   */
  cache?: RequestCache;
  /**
   * Optional signal for aborting the request.
   */
  signal?: AbortSignal;
};

type HttpErrorShape = {
  message: string;
  status: number;
};

export class HttpError extends Error {
  readonly status: number;

  constructor({ message, status }: HttpErrorShape) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export async function httpGetJson<TResponse>(
  path: string,
  options: HttpOptions = {},
): Promise<TResponse> {
  const baseUrl = getDummyJsonBaseUrl();
  const url = new URL(path, baseUrl);

  if (options.searchParams) {
    const params =
      options.searchParams instanceof URLSearchParams
        ? options.searchParams
        : new URLSearchParams();

    if (!(options.searchParams instanceof URLSearchParams)) {
      Object.entries(options.searchParams).forEach(([key, value]) => {
        if (value === undefined) return;
        params.set(key, String(value));
      });
    }

    params.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET" satisfies HttpMethod,
    cache: options.cache,
    signal: options.signal,
  });

  if (!response.ok) {
    const message = `Request to ${url.pathname} failed with ${response.status}`;
    throw new HttpError({ message, status: response.status });
  }

  return (await response.json()) as TResponse;
}

