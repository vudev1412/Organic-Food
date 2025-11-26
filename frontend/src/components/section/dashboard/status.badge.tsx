// File path: /src/components/section/dashboard/status.badge.tsx

import React from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass = "";

  switch (status.toLowerCase()) {
    case "hoạt động":
    case "còn hàng":
    case "đã nhận":
    case "đã giao":
      colorClass = "bg-green-100 text-green-800";
      break;

    case "tạm nghỉ":
    case "tạm ẩn":
    case "đang xử lý":
    case "đang giao":
    case "mới":
      colorClass = "bg-yellow-100 text-yellow-800";
      break;

    case "hết hàng":
    case "đã huỷ":
      colorClass = "bg-red-100 text-red-800";
      break;

    default:
      colorClass = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
