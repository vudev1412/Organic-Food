import React from 'react';
import PageCard from '../../components/section/dashboard/page.card';
import FilterBar from '../../components/section/dashboard/filter.bar';
import DataTable from '../../components/section/dashboard/data.table';
import StatusBadge from '../../components/section/dashboard/status.badge';
import TableActions from '../../components/section/dashboard/table.acction';
import { Pagination } from 'antd';


// --- Kết thúc phần giả lập ---

/**
 * Định nghĩa kiểu dữ liệu cho Product,
 * bám sát schema CSDL
 */
interface IProduct {
  product_id: number;
  category_id: number | null;
  name: string;
  slug: string;
  price: number;
  rating_avg: number;
  image: string;
  description?: string | null;
  unit?: string | null;
  origin_address?: string | null;
  quantity: number; // Tồn kho
  is_active: boolean; // Trạng thái
  mfg_date?: string | null;
  exp_date?: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: number | null;

  // Trường giả lập (lấy từ JOIN với bảng Category)
  categoryName?: string;
}

// Hàm tiện ích định dạng tiền tệ
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Dữ liệu mock mới theo chủ đề "thực phẩm organic"
const mockProducts: IProduct[] = [
  {
    product_id: 1,
    category_id: 1,
    categoryName: 'Rau củ Organic',
    name: 'Cà rốt Organic Đà Lạt',
    slug: 'ca-rot-organic-da-lat',
    price: 55000,
    rating_avg: 4.8,
    image: '/images/ca-rot.jpg',
    unit: 'kg',
    quantity: 120,
    is_active: true,
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-03T14:30:00Z',
  },
  {
    product_id: 2,
    category_id: 2,
    categoryName: 'Trái cây Organic',
    name: 'Táo Envy Organic New Zealand',
    slug: 'tao-envy-organic-nz',
    price: 180000,
    rating_avg: 4.9,
    image: '/images/tao-envy.jpg',
    unit: 'kg',
    quantity: 80,
    is_active: true,
    created_at: '2025-11-02T11:00:00Z',
    updated_at: '2025-11-03T15:00:00Z',
  },
  {
    product_id: 3,
    category_id: 1,
    categoryName: 'Rau củ Organic',
    name: 'Súp lơ xanh Organic',
    slug: 'sup-lo-xanh-organic',
    price: 45000,
    rating_avg: 4.5,
    image: '/images/sup-lo.jpg',
    unit: 'cây',
    quantity: 0, // Hết hàng
    is_active: false, // Ngừng bán
    created_at: '2025-10-20T09:00:00Z',
    updated_at: '2025-11-01T18:00:00Z',
  },
  {
    product_id: 4,
    category_id: 3,
    categoryName: 'Thịt Organic',
    name: 'Ức gà phi lê Organic',
    slug: 'uc-ga-phi-le-organic',
    price: 120000,
    rating_avg: 4.7,
    image: '/images/uc-ga.jpg',
    unit: 'kg',
    quantity: 50,
    is_active: true,
    created_at: '2025-11-03T08:00:00Z',
    updated_at: '2025-11-03T16:00:00Z',
  },
];


/**
 * Component Quản lý Sản phẩm
 * Đã cập nhật để dùng TS và interface IProduct
 */
const Products: React.FC = () => (
  <PageCard title="Quản lý Sản phẩm" >
    <FilterBar placeholder="Tìm kiếm sản phẩm..." buttonText="Thêm Sản phẩm" />
    <DataTable
      columns={['Tên sản phẩm', 'Loại sản phẩm', 'Giá', 'Tồn kho', 'Trạng thái', 'Hành động']}
      data={mockProducts}
      // Cập nhật renderRow để khớp với interface IProduct
      renderRow={(prod: IProduct) => (
        <tr key={prod.product_id} className="border-b hover:bg-gray-50">
          <td className="p-4 text-sm text-gray-800">{prod.name}</td>
          <td className="p-4 text-sm text-gray-600">
            {/* Hiển thị tên loại, hoặc '—' nếu không có */}
            {prod.categoryName || '—'}
          </td>
          <td className="p-4 text-sm text-gray-600">
            {/* Định dạng giá tiền */}
            {formatPrice(prod.price)}
          </td>
          <td className="p-4 text-sm text-gray-600">
            {/* Dùng 'quantity' thay cho 'stock' */}
            {prod.quantity}
          </td>
          <td className="p-4">
            {/* Chuyển 'is_active' (boolean) thành prop (string) */}
            <StatusBadge status={prod.is_active ? 'Active' : 'Inactive'} />
          </td>
          <td className="p-4"><TableActions /></td>
        </tr>
      )}
    />
    <Pagination />
  </PageCard>
);

export default Products;