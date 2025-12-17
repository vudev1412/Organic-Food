// File path: /src/utils/phone.helper.ts

export const isValidVietnamPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s+/g, "");

  const regex = /^(?:\+?84|0)(3|5|7|8|9)([0-9]{8})$/;

  return regex.test(cleaned);
};
export const normalizeVietnamPhone = (phone: string) => {
  const cleaned = phone.replace(/[\s-]/g, "");

  if (cleaned.startsWith("+84")) {
    return "0" + cleaned.slice(3);
  }

  if (cleaned.startsWith("84")) {
    return "0" + cleaned.slice(2);
  }

  return cleaned;
};
