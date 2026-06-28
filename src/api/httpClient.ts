import { environment } from "../config/environment";
import { secureTokenStorage } from "../services/security/secureTokenStorage";
import { unwrapApiResponse } from "./response";

type RequestOptions = RequestInit & {
  auth?: boolean;
  timeoutMs?: number;
};

export class HttpClient {
  constructor(private readonly baseUrl = environment.apiBaseUrl) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

    try {
      const headers = new Headers(options.headers);
      headers.set("Accept", "application/json");

      if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      if (options.auth !== false) {
        const token = await secureTokenStorage.getAccessToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers,
        signal: controller.signal,
      });
      return (await unwrapApiResponse<T>(response)).data;
    } finally {
      clearTimeout(timeout);
    }
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined });
  }
}

export const httpClient = new HttpClient();
