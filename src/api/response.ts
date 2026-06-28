import { ApiError, toApiError } from "./errors";

export type ApiResponse<T> = {
  data: T;
  requestId?: string;
  receivedAt: string;
};

export type ApiResult<T> = { ok: true; value: T } | { ok: false; error: ApiError };

export async function unwrapApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const requestId = response.headers.get("x-request-id") ?? undefined;
  const receivedAt = new Date().toISOString();
  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Request failed with ${response.status}`,
      response.status === 401
        ? "AUTH_REQUIRED"
        : response.status === 403
          ? "FORBIDDEN"
          : response.status === 404
            ? "NOT_FOUND"
            : response.status === 422
              ? "VALIDATION_ERROR"
              : response.status === 429
                ? "RATE_LIMITED"
                : response.status >= 500
                  ? "SERVER_ERROR"
                  : "UNKNOWN",
      response.status,
      payload,
    );
  }

  return {
    data: payload?.data ?? payload,
    requestId,
    receivedAt,
  };
}

export async function asResult<T>(work: () => Promise<T>): Promise<ApiResult<T>> {
  try {
    return { ok: true, value: await work() };
  } catch (error) {
    return { ok: false, error: toApiError(error) };
  }
}
