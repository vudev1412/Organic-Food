import React from "react";
import PageCard from "../../components/section/dashboard/page.card";
import FilterBar from "../../components/section/dashboard/filter.bar";
import DataTable from "../../components/section/dashboard/data.table";
import StatusBadge from "../../components/section/dashboard/status.badge";
import TableActions from "../../components/section/dashboard/table.acction";
import { Pagination } from "antd";

// 🔹 Kiểu dữ liệu cho nhân viên
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
}

// 🔹 Dữ liệu mẫu
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@organic.vn",
    role: "Quản trị viên",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@organic.vn",
    role: "Nhân viên bán hàng",
    status: "inactive",
  },
  {
    id: 3,
    name: "Lê Minh C",
    email: "minhc@organic.vn",
    role: "Thủ kho",
    status: "pending",
  },
];

const Employees: React.FC = () => {
  return (
    <PageCard title="Quản lý Nhân viên">
      <FilterBar
        placeholder="Tìm kiếm nhân viên..."
        buttonText="Thêm Nhân viên"
        onButtonClick={() => console.log("Thêm nhân viên mới")}
      />

      <DataTable
        columns={[
          "Tên",
          "Email",
          "Vai trò (Phân quyền)",
          "Trạng thái",
          "Hành động",
        ]}
        data={mockEmployees}
        renderRow={(emp) => (
          <tr key={emp.id} className="border-b hover:bg-gray-50">
            <td className="p-4 text-sm text-gray-800">{emp.name}</td>
            <td className="p-4 text-sm text-gray-600">{emp.email}</td>
            <td className="p-4 text-sm text-gray-600">{emp.role}</td>
            <td className="p-4">
              <StatusBadge status={emp.status} />
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
};

export default Employees;
