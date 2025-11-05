import React from "react";
import PageCard from "../../components/section/dashboard/page.card";
import FilterBar from "../../components/section/dashboard/filter.bar";
import DataTable from "../../components/section/dashboard/data.table";
import { Pagination } from "antd";
import TableActions from "../../components/section/dashboard/table.acction";

interface ISupplier {
  supplier_id: number;
  name: string;
  code?: string | null;
  tax_no?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

// Dữ liệu mock mới cho Nhà cung cấp
const mockSuppliers: ISupplier[] = [
  {
    supplier_id: 1,
    name: "Nông trại Organic Đà Lạt",
    code: "NCC-DL01",
    tax_no: "0312345678",
    phone: "0909123456",
    email: "info@dalatorganic.vn",
    address: "123 Hùng Vương, P. 10, TP. Đà Lạt, Lâm Đồng",
  },
  {
    supplier_id: 2,
    name: "Công ty Hạt Giống Hữu Cơ Việt Nam",
    code: "NCC-HG02",
    tax_no: "0109876543",
    phone: "02838112233",
    email: "contact@hatgionghuuco.com",
    address: "456 Lê Văn Sỹ, P. 1, Q. Tân Bình, TP. HCM",
  },
  {
    supplier_id: 3,
    name: "Nhà nhập khẩu Trái Cây Sạch (AusFarm)",
    code: "NCC-NK03",
    tax_no: null, // Có thể null
    phone: "0912778899",
    email: "sales@ausfarm.com.au",
    address: "Khu công nghiệp Sóng Thần, Bình Dương",
  },
  {
    supplier_id: 4,
    name: "Hợp tác xã Rau Sạch Củ Chi",
    code: "NCC-CC04",
    tax_no: "0301122334",
    phone: "02837901234",
    email: "htx@rausachcuchi.vn",
    address: "Ấp 4, Xã Tân Thạnh Đông, Huyện Củ Chi, TP. HCM",
  },
];

/**
 * Component Quản lý Nhà cung cấp
 * Đã cập nhật để dùng TS và interface ISupplier
 */
const Suppliers: React.FC = () => (
  <PageCard title="Quản lý Nhà cung cấp">
    <FilterBar
      placeholder="Tìm kiếm nhà cung cấp..."
      buttonText="Thêm Nhà cung cấp"
    />
    <DataTable
      columns={["Tên nhà cung cấp", "Liên hệ", "Email", "Địa chỉ", "Hành động"]}
      data={mockSuppliers}
      // Cập nhật renderRow để khớp với interface ISupplier
      renderRow={(sup: ISupplier) => (
        <tr key={sup.supplier_id} className="border-b hover:bg-gray-50">
          <td className="p-4 text-sm text-gray-800">{sup.name}</td>
          <td className="p-4 text-sm text-gray-600">
            {/* Dùng 'phone' thay cho 'contact' */}
            {sup.phone || "—"}
          </td>
          <td className="p-4 text-sm text-gray-600">{sup.email || "—"}</td>
          <td className="p-4 text-sm text-gray-600">{sup.address || "—"}</td>
          <td className="p-4">
            <TableActions />
          </td>
        </tr>
      )}
    />
    <Pagination />
  </PageCard>
);

export default Suppliers;
