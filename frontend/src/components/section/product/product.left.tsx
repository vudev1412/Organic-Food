import React, { useState, useEffect } from "react";
import { getAllCategoriesAPI } from "../../../service/api";
import "./product.left.scss";

// --- ICON (Giữ nguyên) ---
const ChevronDownIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// --- COMPONENT CHÍNH ---
const ProductLeft = () => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Lấy danh mục từ API khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesAPI();
        if (response && response.data && "data" in response.data) {
          const allCats = (response.data as unknown as IBackendRes<ICategory[]>)
            .data as ICategory[];
          if (allCats && Array.isArray(allCats)) {
            setAllCategories(allCats);
            // Lọc chỉ danh mục cha (parentCategory === null)
            const parentCategories = allCats.filter(
              (cat: ICategory) => cat.parentCategory === null
            );
            setCategories(parentCategories);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="product-left w-full max-w-xs space-y-8">
      {/* Khối Danh mục */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-base text-gray-800 p-4 border-b border-gray-200">
          Danh mục sản phẩm
        </h3>
        <nav className="p-3 space-y-1">
          {categories.map((category) => {
            // Lấy tất cả danh mục con của danh mục cha này
            const subCategories = allCategories.filter(
              (c: ICategory) => c.parentCategory?.id === category.id
            );
            return (
              <div key={category.name}>
                {subCategories.length > 0 ? (
                  <>
                    {/* --- THAY ĐỔI Ở ĐÂY --- */}
                    {/* Chúng ta tách <button> cũ thành một <div> cha
                      để giữ hiệu ứng hover, bên trong chứa:
                      1. Thẻ <a> để điều hướng.
                      2. Thẻ <button> chỉ chứa icon để toggle.
                    */}
                    <div
                      className={`
                        flex justify-between items-center w-full p-3 rounded-md text-gray-700 font-medium text-sm
                        transition-colors duration-200 ease-in-out
                        hover:bg-green-600 hover:text-white
                        group 
                      `}
                    >
                      {/* 1. Liên kết danh mục cha */}
                      <a
                        href={`/danh-muc/${category.slug}`}
                        className="flex-grow group-hover:!text-white !text-[#4b5563]" // Thừa hưởng màu text khi hover
                      >
                        {category.name}
                      </a>

                      {/* 2. Nút bấm để toggle */}
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="pl-2 group-hover:text-white" // Thừa hưởng màu text khi hover
                      >
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openCategories[category.name] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {/* --- KẾT THÚC THAY ĐỔI --- */}

                    {/* Danh mục con (Giữ nguyên) */}
                    {openCategories[category.name] && (
                      <ul className="pl-4 mt-1 mb-2 space-y-1 border-l border-gray-200 ml-3">
                        {subCategories.map((sub: ICategory) => (
                          <li key={sub.slug}>
                            <a
                              href={`/danh-muc/${sub.slug}`}
                              className="category-child"
                            >
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // Giữ nguyên cho danh mục không có con
                  <a
                    href={`/danh-muc/${category.slug}`}
                    className={`
                      category-parent-link
                      flex justify-between items-center w-full p-3 rounded-md text-gray-700 font-medium text-sm
                      transition-colors duration-200 ease-in-out
                      hover:bg-green-600 hover:text-white
                    `}
                  >
                    <span>{category.name}</span>
                  </a>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ProductLeft;
