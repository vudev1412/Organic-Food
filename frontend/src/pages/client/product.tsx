import React, { useEffect, useState } from "react";
import ProductLeft from "../../components/section/product/product.left";
import ProductRight from "../../components/section/product/product.right";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCategoriesAPI } from "../../service/api"; // Import API

interface ICategory {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number | null;
}

const ProductPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  
  // State lưu danh sách danh mục để tra cứu ID từ Slug
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  const { slug } = useParams(); 

  // 1. Gọi API lấy danh sách danh mục khi vào trang
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesAPI();
        const results = response?.data?.data?.result;
        if (Array.isArray(results)) {
          setAllCategories(results);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Lắng nghe sự thay đổi của URL (slug) hoặc danh sách danh mục
  useEffect(() => {
    if (allCategories.length > 0) {
      if (slug) {
        // Tìm category tương ứng với slug
        const foundCategory = allCategories.find((c) => c.slug === slug);
        if (foundCategory) {
          setSelectedCategoryId(foundCategory.id);
          setSelectedCategoryName(foundCategory.name);
        }
      } else {
        // Nếu không có slug (trang /san-pham gốc), reset về null
        setSelectedCategoryId(null);
        setSelectedCategoryName("Tất cả sản phẩm");
      }
    }
  }, [slug, allCategories]);

  // Hàm xử lý khi click ở menu trái
  const handleSelectCategory = (id: number | null, name: string) => {
    // Chỉ cần update UI ngay lập tức cho mượt (Optional vì useEffect ở trên đã lo rồi)
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
  };

  return (
    <div className="flex px-[40px] mt-[40px]">
      <div className="w-1/3">
        <ProductLeft onSelectCategory={handleSelectCategory} />
      </div>
      <div className="w-2/3">
        <ProductRight
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
        />
      </div>
    </div>
  );
};

export default ProductPage;