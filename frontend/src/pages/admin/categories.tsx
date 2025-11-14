import React from 'react';
import PageCard from '../../components/section/dashboard/page.card';
import FilterBar from '../../components/section/dashboard/filter.bar';
import DataTable from '../../components/section/dashboard/data.table';
import StatusBadge from '../../components/section/dashboard/status.badge';
import TableActions from '../../components/section/dashboard/table.acction';
import { Pagination } from 'antd';
import TableCategory from '../../components/admin/category/table.category';



/**
 * Định nghĩa kiểu dữ liệu cho Category,
 * bám sát DB schema và thêm các trường cần thiết cho UI
 */
const Categories = () => {
  return (
    <>
      <TableCategory/>
    </>
  )
}

export default Categories;