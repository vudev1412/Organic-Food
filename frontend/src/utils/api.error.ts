import type { AxiosResponse } from "axios";

/*
 * axios.customize.ts: khi API lỗi (4xx/5xx), interceptor KHÔNG throw mà trả về
 * body lỗi { statusCode, error, message }. Vì vậy kết quả của `await api()` có thể là:
 *   - AxiosResponse<IBackendRes<T>> khi thành công
 *   - IBackendRes<null> (body lỗi) khi thất bại
 * Các hàm dưới đây đọc lỗi an toàn cho cả hai trường hợp.
 */

type ErrorField = "message" | "error";

const isAxiosResponse = (res: unknown): res is AxiosResponse =>
  !!res && typeof res === "object" && "headers" in res && "status" in res;

const getBody = (res: unknown): Partial<IBackendRes<unknown>> | undefined => {
  const body = isAxiosResponse(res) ? res.data : res;
  return body && typeof body === "object"
    ? (body as Partial<IBackendRes<unknown>>)
    : undefined;
};

/** true nếu request thất bại (nhận body lỗi, status >= 400, hoặc body có `error`). */
export const isApiFailure = (res: unknown): boolean => {
  if (!res) return true;
  if (isAxiosResponse(res)) return res.status >= 400 || !!getBody(res)?.error;
  return true;
};

/**
 * Lấy thông báo lỗi từ kết quả API.
 * @param fields thứ tự ưu tiên các trường cần đọc (mặc định: message rồi error)
 * @param join   nếu giá trị là mảng: true = nối bằng ", ", false = lấy phần tử đầu
 */
export const getApiError = (
  res: unknown,
  { fields = ["message", "error"], join = false }: { fields?: ErrorField[]; join?: boolean } = {}
): string | undefined => {
  const body = getBody(res);
  if (!body) return undefined;
  for (const field of fields) {
    const value = body[field];
    if (Array.isArray(value) && value.length) return join ? value.join(", ") : value[0];
    if (typeof value === "string" && value) return value;
  }
  return undefined;
};
