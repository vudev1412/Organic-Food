import React from 'react';
import PageCard from '../../components/section/dashboard/page.card';
import FilterBar from '../../components/section/dashboard/filter.bar';
import DataTable from '../../components/section/dashboard/data.table';
import StatusBadge from '../../components/section/dashboard/status.badge';
import TableActions from '../../components/section/dashboard/table.acction';
import { Pagination } from 'antd';



// --- Component StatusBadge được cập nhật để xử lý nhiều trạng thái đơn hàng ---
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';




/**
 * Định nghĩa kiểu dữ liệu cho Order,
 * bám sát schema CSDL và thêm các trường JOIN/tính toán
 */
interface IOrder {
  order_id: number;
  customer_user_id: number;
  order_at: string; // Kiểu DATETIME trong CSDL
  note?: string | null;
  status: OrderStatus;
  ship_address: string;
  estimated_date?: string | null;
  actual_date?: string | null;

  // Trường giả lập (lấy từ JOIN hoặc tính toán)
  customerName: string; // JOIN từ bảng User
  total: number; // Tính toán từ bảng OrderItem
}

// --- Các hàm tiện ích ---
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};


// Dữ liệu mock mới cho Đơn hàng
const mockCustomerOrders: IOrder[] = [
  {
    order_id: 1001,
    customer_user_id: 5,
    customerName: 'Nguyễn Văn An',
    order_at: '2025-11-04T14:30:00Z',
    status: 'pending',
    ship_address: '123 Đường A, P. B, Q. C, TP. HCM',
    total: 850000,
  },
  {
    order_id: 1002,
    customer_user_id: 8,
    customerName: 'Trần Thị Bình',
    order_at: '2025-11-03T09:15:00Z',
    status: 'shipped',
    ship_address: '456 Đường X, P. Y, Q. Z, Hà Nội',
    total: 1200000,
  },
  {
    order_id: 1003,
    customer_user_id: 5,
    customerName: 'Nguyễn Văn An',
    order_at: '2025-11-02T18:00:00Z',
    status: 'delivered',
    ship_address: '123 Đường A, P. B, Q. C, TP. HCM',
    total: 350000,
  },
  {
    order_id: 1004,
    customer_user_id: 12,
    customerName: 'Lê Hoàng Yến',
    order_at: '2025-11-01T11:00:00Z',
    status: 'cancelled',
    ship_address: '789 Đường K, P. M, Q. N, Đà Nẵng',
    total: 200000,
  },
];


/**
 * Component Quản lý Đơn hàng (của khách)
 * Đã cập nhật để dùng TS, interface IOrder và khớp với schema
 */
const CustomerOrders: React.FC = () => (
  <PageCard title="Quản lý Đơn hàng" >
    <FilterBar placeholder="Tìm kiếm đơn hàng (Mã, Tên KH...)" buttonText="Tạo Đơn hàng" />
    <DataTable
      // Cập nhật các cột để khớp với schema 'Order'
      columns={['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái', 'Hành động']}
      data={mockCustomerOrders}
      // Cập nhật renderRow để khớp với interface IOrder
      renderRow={(order: IOrder) => (
        <tr key={order.order_id} className="border-b hover:bg-gray-50">
          <td className="p-4 text-sm text-gray-800 font-medium">
            #{order.order_id}
          </td>
          <td className="p-4 text-sm text-gray-600">
            {order.customerName}
          </td>
          <td className="p-4 text-sm text-gray-600">
            {formatDate(order.order_at)}
          </td>
          <td className="p-4 text-sm text-gray-600">
            {formatPrice(order.total)}
          </td>
          <td className="p-4">
            <StatusBadge status={order.status} />
          </td>
          <td className="p-4"><TableActions /></td>
        </tr>
      )}
    />
    <Pagination />
  </PageCard>
);

export default CustomerOrders;