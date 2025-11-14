import React, { useState, useEffect } from "react";
import { getAllCategoriesAPI } from "../../../service/api";
import "./product.left.scss";


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
      {/* Khối Tìm kiếm */}
      <div role="search">
        <label htmlFor="product-search" className="sr-only">
          Tìm kiếm sản phẩm
        </label>
        <div className="flex items-center w-full rounded-full border border-gray-300 overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-green-500 transition-all">
          <input
            type="text"
            id="product-search"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 px-5 py-2.5 outline-none text-gray-700 bg-transparent text-sm"
          />
          <button
            type="button"
            className="text-gray-400 hover:text-green-600 transition-colors w-12 h-10 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </button>
        </div>
      </div>

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
                    {/* Danh mục cha */}
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className={`
                        flex justify-between items-center w-full p-3 rounded-md text-gray-700 font-medium text-sm
                        transition-colors duration-200 ease-in-out
                        hover:bg-green-600 hover:text-white
                      `}
                    >
                      <span>{category.name}</span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openCategories[category.name] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Danh mục con */}
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
