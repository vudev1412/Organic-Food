import React from "react";
import PageCard from "../../components/section/dashboard/page.card";
import FilterBar from "../../components/section/dashboard/filter.bar";
import DataTable from "../../components/section/dashboard/data.table";
import TableActions from "../../components/section/dashboard/table.acction";
import { Pagination } from "antd";

// 🔹 Định nghĩa kiểu dữ liệu cho khách hàng
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  joinDate: string;
}

// 🔹 Dữ liệu mẫu
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    phone: "0909123456",
    totalOrders: 12,
    joinDate: "2024-03-01",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@example.com",
    phone: "0912345678",
    totalOrders: 8,
    joinDate: "2024-05-20",
  },
  {
    id: 3,
    name: "Lê Minh C",
    email: "minhc@example.com",
    phone: "0987654321",
    totalOrders: 20,
    joinDate: "2024-07-15",
  },
];

const Customers: React.FC = () => {
  return (
    <PageCard title="Quản lý Khách hàng">
      <FilterBar
        placeholder="Tìm kiếm khách hàng..."
        buttonText="Thêm khách hàng"
        onButtonClick={() => console.log("Thêm khách hàng mới")}
      />

      <DataTable
        columns={[
          "Tên",
          "Email",
          "Điện thoại",
          "Tổng đơn",
          "Ngày tham gia",
          "Hành động",
        ]}
        data={mockCustomers}
        renderRow={(customer) => (
          <tr key={customer.id} className="border-b hover:bg-gray-50">
            <td className="p-4 text-sm text-gray-800">{customer.name}</td>
            <td className="p-4 text-sm text-gray-600">{customer.email}</td>
            <td className="p-4 text-sm text-gray-600">{customer.phone}</td>
            <td className="p-4 text-sm text-gray-600">
              {customer.totalOrders}
            </td>
            <td className="p-4 text-sm text-gray-600">{customer.joinDate}</td>
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

export default Customers;
