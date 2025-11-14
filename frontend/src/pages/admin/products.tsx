
import React from 'react';
import PageCard from '../../components/section/dashboard/page.card';
import FilterBar from '../../components/section/dashboard/filter.bar';
import DataTable from '../../components/section/dashboard/data.table';
import StatusBadge from '../../components/section/dashboard/status.badge';
import TableActions from '../../components/section/dashboard/table.acction';
import { Pagination } from 'antd';
import TableProduct from '../../components/admin/product/table.product';


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

import ProductTable from "../../components/admin/product/table.product";


const Products = () => {
  return (
    <>

      <TableProduct/>
    </>
  )
}

export default Products;

      <ProductTable />
    </>
  );
};

export default Products;

