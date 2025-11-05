import React from "react";
import PageCard from "../../components/section/dashboard/page.card";
import FilterBar from "../../components/section/dashboard/filter.bar";
import DataTable from "../../components/section/dashboard/data.table";
import StatusBadge from "../../components/section/dashboard/status.badge";
import TableActions from "../../components/section/dashboard/table.acction";
import { Pagination } from "antd";

// --- Component StatusBadge được cập nhật để xử lý trạng thái Trả hàng ---
type ReturnStatus = "pending" | "approved" | "rejected" | "cancelled";

// --- Component mới để hiển thị Loại Trả hàng ---
type ReturnType = "refund" | "exchange";
const ReturnTypeBadge: React.FC<{ type: ReturnType }> = ({ type }) => {
  const isRefund = type === "refund";
  return (
    <span
      style={{
        backgroundColor: isRefund ? "#17a2b8" : "#fd7e14", // Xanh cyan | Cam
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      {isRefund ? "Hoàn tiền" : "Đổi hàng"}
    </span>
  );
};
// --- Kết thúc phần giả lập ---

/**
 * Định nghĩa kiểu dữ liệu cho Yêu cầu Trả hàng,
 * bám sát schema CSDL
 */
interface IReturn {
  return_id: number;
  order_id: number;
  reason?: string | null;
  status: ReturnStatus;
  return_type: ReturnType;
  create_at: string; // DATETIME
  approved_at?: string | null;
  processed_by?: number | null;
  processed_note?: string | null;

  // Trường giả lập (lấy từ JOIN)
  customerName: string;
  issueSummary: string; // Tóm tắt 'reason' cho UI
}

// Hàm tiện ích định dạng ngày
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Dữ liệu mock mới cho Yêu cầu Trả hàng
const mockReturns: IReturn[] = [
  {
    return_id: 1,
    order_id: 1002, // Giả sử đơn hàng của 'Trần Thị Bình'
    customerName: "Trần Thị Bình",
    reason:
      "Sản phẩm cà rốt organic bị dập nát khi nhận hàng, yêu cầu đổi sản phẩm mới.",
    issueSummary: "Hàng bị dập nát...",
    status: "pending",
    return_type: "exchange",
    create_at: "2025-11-04T10:30:00Z",
  },
  {
    return_id: 2,
    order_id: 1003, // Giả sử đơn hàng của 'Nguyễn Văn An'
    customerName: "Nguyễn Văn An",
    reason: "Giao nhầm súp lơ xanh thành súp lơ trắng. Tôi muốn hoàn tiền.",
    issueSummary: "Giao nhầm sản phẩm",
    status: "approved",
    return_type: "refund",
    create_at: "2025-11-03T14:00:00Z",
    approved_at: "2025-11-04T09:00:00Z",
    processed_by: 2,
  },
  {
    return_id: 3,
    order_id: 1001, // Giả sử đơn hàng của 'Nguyễn Văn An'
    customerName: "Nguyễn Văn An",
    reason: "Không còn nhu cầu sử dụng sản phẩm.",
    issueSummary: "Không còn nhu cầu",
    status: "rejected",
    return_type: "refund",
    create_at: "2025-11-02T11:00:00Z",
    approved_at: "2025-11-02T17:00:00Z",
    processed_by: 2,
    processed_note: "Lý do trả hàng không hợp lệ (ngoài chính sách).",
  },
  {
    return_id: 4,
    order_id: 1004, // Giả sử đơn hàng của 'Lê Hoàng Yến' (đã hủy)
    customerName: "Lê Hoàng Yến",
    reason: "Đã hủy đơn hàng, không nhận hàng.",
    issueSummary: "Hủy đơn",
    status: "cancelled",
    return_type: "refund",
    create_at: "2025-11-01T12:00:00Z",
  },
];

/**
 * Component Quản lý Yêu cầu Trả hàng
 * Đã cập nhật để dùng TS, interface IReturn và khớp với schema
 */
const ReturnRequests: React.FC = () => (
  // Đổi title thành "Quản lý Yêu cầu Trả hàng"
  <PageCard title="Quản lý Yêu cầu Trả hàng">
    <FilterBar placeholder="Tìm kiếm theo Mã YC, Mã đơn hàng..." />
    <DataTable
      // Cập nhật các cột
      columns={[
        "Mã YC",
        "Mã đơn hàng",
        "Khách hàng",
        "Ngày tạo",
        "Lý do",
        "Loại YC",
        "Trạng thái",
        "Hành động",
      ]}
      data={mockReturns}
      // Cập nhật renderRow để khớp với interface IReturn
      renderRow={(ret: IReturn) => (
        <tr key={ret.return_id} className="border-b hover:bg-gray-50">
          <td className="p-4 text-sm text-gray-800 font-medium">
            #{ret.return_id}
          </td>
          <td className="p-4 text-sm text-gray-600">#{ret.order_id}</td>
          <td className="p-4 text-sm text-gray-600">{ret.customerName}</td>
          <td className="p-4 text-sm text-gray-600">
            {formatDate(ret.create_at)}
          </td>
          <td className="p-4 text-sm text-gray-600">{ret.issueSummary}</td>
          <td className="p-4">
            <ReturnTypeBadge type={ret.return_type} />
          </td>
          <td className="p-4">
            <StatusBadge status={ret.status} />
          </td>
          <td className="p-4">
            <TableActions />
          </td>
        </tr>
      )}
    />
    <Pagination />
  </PageCard>
);

export default ReturnRequests;
