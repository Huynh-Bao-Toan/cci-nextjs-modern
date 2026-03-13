import axios, { AxiosError } from "axios"

import { getDummyJsonBaseUrl } from "./env"

export type ApiError = {
  message: string
  status: number
}

export class ApiClientError extends Error {
  readonly status: number

  constructor(error: ApiError) {
    super(error.message)
    this.name = "ApiClientError"
    this.status = error.status
  }
}

export const apiClient = axios.create({
  baseURL: getDummyJsonBaseUrl(),
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})

export function toApiClientError(error: unknown): ApiClientError {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<{ message?: string }>
    const status = ax.response?.status ?? 0
    const message =
      ax.response?.data?.message ??
      ax.message ??
      "Request failed. Please try again."
    return new ApiClientError({ message, status })
  }

  if (error instanceof Error) {
    return new ApiClientError({ message: error.message, status: 0 })
  }

  return new ApiClientError({
    message: "Unexpected error. Please try again.",
    status: 0,
  })
}

