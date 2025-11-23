import React, { useState, useEffect } from "react";
import { getAllCategoriesAPI } from "../../../service/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

interface ProductLeftProps {
  onSelectCategory: (id: number | null, name: string) => void;
}

interface ICategory {
  id: number;
  name: string;
  parentCategoryId: number | null;
  slug: string;
}

const ProductLeft = ({ onSelectCategory }: ProductLeftProps) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesAPI();
        const results = response?.data?.data?.result;
        if (Array.isArray(results)) {
          setAllCategories(results);
          const parentCategories = results.filter(
            (cat: ICategory) => cat.parentCategoryId === null
          );
          setCategories(parentCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (slug && allCategories.length > 0) {
      const currentCategory = allCategories.find((c) => c.slug === slug);
      if (currentCategory?.parentCategoryId) {
        const parent = allCategories.find(
          (c) => c.id === currentCategory.parentCategoryId
        );
        if (parent)
          setOpenCategories((prev) => ({ ...prev, [parent.name]: true }));
      } else if (currentCategory) {
        setOpenCategories((prev) => ({
          ...prev,
          [currentCategory.name]: true,
        }));
      }
    }
  }, [slug, allCategories]);

  const checkActive = (itemSlug: string | null) => {
    if (!itemSlug && !slug && location.pathname === "/san-pham") return true;
    return slug === itemSlug;
  };

  const handleCategoryClick = (
    e: React.MouseEvent,
    id: number | null,
    name: string,
    slugParam: string | null
  ) => {
    e.preventDefault();
    onSelectCategory(id, name);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (slugParam && slugParam !== "san-pham") {
      navigate(`/danh-muc/${slugParam}`);
    } else {
      navigate("/san-pham");
    }
  };

  return (
    <div className="product-left w-full max-w-xs space-y-8 sticky top-24">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* --- 1. Tiêu đề chính --- */}
        <h3
          // Chỉ giữ lại class layout, màu sắc để SCSS lo (h3.active)
          className={`font-semibold text-base p-4 border-b border-gray-200 cursor-pointer ${
            !slug && location.pathname === "/san-pham" ? "active" : ""
          }`}
          onClick={(e) =>
            handleCategoryClick(e, null, "Tất cả sản phẩm", "san-pham")
          }
        >
          Danh mục sản phẩm
        </h3>

        <nav className="p-3 space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
          {categories.map((category) => {
            const subCategories = allCategories.filter(
              (c) => c.parentCategoryId === category.id
            );
            const categoryLink = `/danh-muc/${category.slug}`;

            return (
              <div key={category.id}>
                {subCategories.length > 0 ? (
                  <>
                    {/* --- 2. Danh mục cha có con (Group Header) --- */}
                    <div
                      // Đã xóa các class màu Tailwind cũ, chỉ giữ class layout + SCSS class
                      className={`category-group-header flex justify-between items-center w-full p-3 rounded-md font-medium text-sm cursor-pointer ${
                        checkActive(category.slug) ? "active" : ""
                      }`}
                    >
                      <a
                        href={categoryLink}
                        onClick={(e) =>
                          handleCategoryClick(
                            e,
                            category.id,
                            category.name,
                            category.slug
                          )
                        }
                        // Xóa text-gray, group-hover...
                        className="flex-grow"
                      >
                        {category.name}
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.name);
                        }}
                        className="pl-2"
                      >
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openCategories[category.name] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* --- 3. Danh mục con (Child) --- */}
                    {openCategories[category.name] && (
                      <ul className="pl-4 mt-1 mb-2 space-y-1 border-l border-gray-200 ml-3">
                        {subCategories.map((sub) => {
                          const subLink = `/danh-muc/${sub.slug}`;
                          return (
                            <li key={sub.id}>
                              <a
                                href={subLink}
                                onClick={(e) =>
                                  handleCategoryClick(
                                    e,
                                    sub.id,
                                    sub.name,
                                    sub.slug
                                  )
                                }
                                // Sử dụng class 'category-child' từ SCSS
                                className={`category-child ${
                                  checkActive(sub.slug) ? "active" : ""
                                }`}
                              >
                                {sub.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  /* --- 4. Danh mục cha không con (Parent Link) --- */
                  <a
                    href={categoryLink}
                    onClick={(e) =>
                      handleCategoryClick(
                        e,
                        category.id,
                        category.name,
                        category.slug
                      )
                    }
                    // Sử dụng class 'category-parent-link' từ SCSS
                    className={`category-parent-link flex justify-between items-center w-full p-3 rounded-md font-medium text-sm ${
                      checkActive(category.slug) ? "active" : ""
                    }`}
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