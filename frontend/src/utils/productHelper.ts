// --- 1. Định nghĩa Types ---
export interface DescriptionItem {
  subtitle: string;
  text: string;
}

export interface DescriptionSection {
  heading: string;
  items: DescriptionItem[];
}

export type ParsedDescriptionResult =
  | { type: "json"; content: DescriptionSection[] }
  | { type: "html"; content: string };

// --- 2. Hàm xử lý chính ---
// ... import giữ nguyên

export const parseProductDescription = (
  description: string | undefined | null
): ParsedDescriptionResult => {
  if (!description) {
    return { type: "html", content: "" };
  }

  try {
    // === MẸO CHỮA CHÁY (NẾU DỮ LIỆU DÙNG DẤU NHÁY ĐƠN) ===
    // Thử parse JSON chuẩn trước
    let jsonData;
    try {
      jsonData = JSON.parse(description);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Nếu lỗi, thử thay thế dấu nháy đơn ' thành nháy kép " để cứu vãn
      // CHỈ DÙNG KHI BẠN KHÔNG THỂ SỬA DATABASE
      const fixedJson = description.replace(/'/g, '"');
      jsonData = JSON.parse(fixedJson);
    }
    // ======================================================

    if (Array.isArray(jsonData) && jsonData.length > 0) {
      return { type: "json", content: jsonData as DescriptionSection[] };
    }

    throw new Error("Invalid structure");
  } catch (error) {
    console.warn("Vẫn lỗi sau khi cố gắng sửa:", error);
    return { type: "html", content: description };
  }
};
