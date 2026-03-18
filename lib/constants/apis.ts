import { getDummyJsonBaseUrl } from "@/lib/api/env";

export enum ApiService {
  DummyJson = "dummyJson",
}

export const apiBaseUrls: Record<ApiService, string> = {
  [ApiService.DummyJson]: getDummyJsonBaseUrl(),
};
