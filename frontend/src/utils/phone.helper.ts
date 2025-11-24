export const isValidVietnamPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s+/g, "");

  const regex = /^(?:\+?84|0)(3|5|7|8|9)([0-9]{8})$/;

  return regex.test(cleaned);
};
