import React from 'react';
import PageCard from '../../components/section/dashboard/page.card';
import FilterBar from '../../components/section/dashboard/filter.bar';
import DataTable from '../../components/section/dashboard/data.table';
import StatusBadge from '../../components/section/dashboard/status.badge';
import TableActions from '../../components/section/dashboard/table.acction';
import { Pagination } from 'antd';



/**
 * Định nghĩa kiểu dữ liệu cho Category,
 * bám sát DB schema và thêm các trường cần thiết cho UI
 */
interface ICategory {
  category_id: number;
  name: string;
  slug: string;
  parent_category_id: number | null;
  parentName?: string; // Tên danh mục cha (thường lấy từ JOIN hoặc logic xử lý)
  productCount: number; // Dữ liệu tính toán (không có trong bảng Category)
  status: 'Active' | 'Inactive'; // Giả định trạng thái (không có trong bảng Category)
}

// Dữ liệu mock mới dựa trên interface ICategory
const mockCategories: ICategory[] = [
  {
    category_id: 1,
    name: 'Điện tử',
    slug: 'dien-tu',
    parent_category_id: null,
    parentName: '—', // Dùng '—' cho danh mục gốc
    productCount: 150,
    status: 'Active',
  },
  {
    category_id: 2,
    name: 'Điện thoại',
    slug: 'dien-thoai',
    parent_category_id: 1,
    parentName: 'Điện tử',
    productCount: 80,
    status: 'Active',
  },
  {
    category_id: 3,
    name: 'Thời trang',
    slug: 'thoi-trang',
    parent_category_id: null,
    parentName: '—',
    productCount: 300,
    status: 'Inactive',
  },
  {
    category_id: 4,
    name: 'Áo Sơ mi',
    slug: 'ao-so-mi',
    parent_category_id: 3,
    parentName: 'Thời trang',
    productCount: 120,
    status: 'Active',
  },
];

/**
 * Component Quản lý Loại sản phẩm
 * Đã cập nhật cột và renderRow để khớp với DB schema mới
 */
const Categories: React.FC = () => {
  return (
    <PageCard title="Quản lý Loại sản phẩm" >
      <FilterBar placeholder="Tìm kiếm loại sản phẩm..."  buttonText="Thêm Loại sản phẩm"/>
      <DataTable
        // Cập nhật các cột mới để bao gồm 'Slug' và 'Danh mục cha'
        columns={['Tên loại', 'Slug', 'Danh mục cha', 'Số lượng sản phẩm', 'Trạng thái', 'Hành động']}
        data={mockCategories}
        // Thêm kiểu 'ICategory' cho 'cat'
        renderRow={(cat: ICategory) => (
          <tr key={cat.category_id} className="border-b hover:bg-gray-50">
            {/* Cập nhật các ô <td> để khớp với dữ liệu mới */}
            <td className="p-4 text-sm text-gray-800">{cat.name}</td>
            <td className="p-4 text-sm text-gray-600">{cat.slug}</td>
            <td className="p-4 text-sm text-gray-600">
              {/* Hiển thị tên cha, hoặc '—' nếu không có */}
              {cat.parentName || '—'}
            </td>
            <td className="p-4 text-sm text-gray-600">{cat.productCount}</td>
            <td className="p-4"><StatusBadge status={cat.status} /></td>
            <td className="p-4"><TableActions /></td>
          </tr>
        )}
      />
      <Pagination />
    </PageCard>
  );
};

export default Categories;