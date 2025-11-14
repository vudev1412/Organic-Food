export function parseDescription(text: string) {
  if (!text) return "";

  let t = text.trim();

  // --- Escape HTML ---
  t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // --- Chuẩn hoá xuống dòng ---
  t = t.replace(/\r\n/g, "\n");
  t = t.replace(/\n{2,}/g, "\n\n");

  const lines = t.split("\n");

  const html: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  lines.forEach((line, index) => {
    let l = line.trim();
    if (!l) return; // Bỏ qua dòng trống

    // --- Xử lý bold markdown trước khi check heading ---
    const originalLine = l;
    const strippedLine = l.replace(/\*\*/g, ""); // Bỏ ** để check pattern

    // --- Heading lớn (H2): các mục chính ---
    // Bắt cả "Điểm nổi bật của...", "Công dụng nổi bật", "Hướng dẫn sử dụng", "Bảo quản"
    if (
      /^(Điểm nổi bật của|Công dụng nổi bật|Hướng dẫn sử dụng)/i.test(
        strippedLine
      ) ||
      /^Bảo quản$/i.test(strippedLine)
    ) {
      closeList();
      html.push(
        `<h2 class="text-2xl font-bold text-green-700 mt-6 mb-3">${strippedLine}</h2>`
      );
      return;
    }

    // --- Heading số thứ tự (H3): dạng "1. Tiêu đề", "2. Tiêu đề" ---
    if (/^\d+\.\s+.+/.test(strippedLine)) {
      closeList();
      html.push(
        `<h5 class="text-base font-semibold text-green-600 mt-3 mb-2">${strippedLine}</h5>`
      );
      return;
    }

    // --- Bullet list ---
    if (/^\*/.test(originalLine)) {
      if (!listOpen) {
        html.push('<ul class="list-disc pl-6 space-y-1 mb-3">');
        listOpen = true;
      }
      const listContent = originalLine
        .replace(/^\*\s*/, "")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html.push(`<li>${listContent}</li>`);
      return;
    }

    // --- Heading nhỏ (H3): tiêu đề phụ ---
    // Điều kiện: dòng ngắn (< 100 ký tự), không có dấu chấm cuối, không phải dòng đầu tiên
    if (strippedLine.length < 100 && !/\.$/.test(strippedLine) && index > 0) {
      closeList();
      html.push(
        `<h5 class="text-base font-semibold text-green-600 mt-3 mb-2">${strippedLine}</h5>`
      );
      return;
    }

    // --- Paragraph: mặc định ---
    closeList();
    const paragraphContent = originalLine.replace(
      /\*\*(.+?)\*\*/g,
      "<strong>$1</strong>"
    );
    html.push(`<p class="mb-3 leading-relaxed">${paragraphContent}</p>`);
  });

  closeList();

  return html.join("\n");
}
