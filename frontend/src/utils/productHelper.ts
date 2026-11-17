// File path: /src/utils/productHelper.ts

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

    if (Array.isArray(jsonData)) {
      // Bỏ các section/item rỗng (heading, subtitle, text đều trống)
      const sections = (jsonData as DescriptionSection[])
        .map((section) => ({
          heading: section?.heading?.trim() ?? "",
          items: (section?.items ?? []).filter(
            (item) => item?.subtitle?.trim() || item?.text?.trim()
          ),
        }))
        .filter((section) => section.heading || section.items.length > 0);

      if (sections.length === 0) {
        return { type: "html", content: "" };
      }
      return { type: "json", content: sections };
    }

    throw new Error("Invalid structure");
  } catch (error) {
    console.warn("Vẫn lỗi sau khi cố gắng sửa:", error);
    return { type: "html", content: description };
  }
};
