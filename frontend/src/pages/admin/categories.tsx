// File path: /src/pages/admin/categories.tsx

import TableCategory from "../../components/admin/category/table.category";

/**
 * Định nghĩa kiểu dữ liệu cho Category,
 * bám sát DB schema và thêm các trường cần thiết cho UI
 */
const Categories = () => {
  return (
    <>
      <TableCategory />
    </>
  );
};

export default Categories;
