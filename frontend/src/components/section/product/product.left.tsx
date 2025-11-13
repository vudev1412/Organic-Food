import React, { useState } from "react";

// --- DỮ LIỆU GIẢ ---
const productCategories = [
  {
    name: "Quà Tặng Trái cây",
    url: "/collections/hop-qua-trai-cay",
    sub_items: [],
  },
  {
    name: "Trái Cây Theo Mùa",
    url: "/collections/trai-cay-theo-mua",
    sub_items: [
      { name: "Trái Cây Việt", url: "/collections/trai-cay-viet" },
      { name: "Trái Cây Nhập Khẩu", url: "/collections/trai-cay-nhap-khau" },
    ],
  },
  {
    name: "Rau Củ Quả",
    url: "/collections/rau-cu-qua",
    sub_items: [
      { name: "Rau lá hữu cơ", url: "/collections/rau-la-huu-co" },
      { name: "Củ Quả hữu cơ", url: "/collections/cu-qua-huu-co" },
      { name: "Nấm", url: "/collections/nam" },
    ],
  },
  {
    name: "Bếp O - Ready To Eat",
    url: "/collections/bep-org-ready-to-eat",
    sub_items: [],
  },
];
// --- KẾT THÚC DỮ LIỆU GIẢ ---

// --- COMPONENT ICON ---
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

const CartIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);
// --- KẾT THÚC ICON ---

const ProductLeft = () => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="w-full max-w-xs space-y-8">
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
          {productCategories.map((category) => (
            <div key={category.name}>
              {category.sub_items.length > 0 ? (
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
                      {category.sub_items.map((sub) => (
                        <li key={sub.name}>
                          <a
                            href={sub.url}
                            className="block p-2 rounded-md text-gray-600 text-sm
                                       transition-colors duration-200 ease-in-out
                                       hover:bg-green-100 hover:text-green-700"
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
                  href={category.url}
                  className={`
                    flex justify-between items-center w-full p-3 rounded-md text-gray-700 font-medium text-sm
                    transition-colors duration-200 ease-in-out
                    hover:bg-green-600 hover:text-white
                  `}
                >
                  <span>{category.name}</span>
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Khối Giỏ hàng */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-base text-gray-800 p-4 border-b border-gray-200">
          Giỏ hàng
        </h3>
        <div className="p-4">
          <div className="flex items-center justify-center text-gray-500 p-4 bg-gray-50 rounded-md text-sm">
            <div className="flex items-center justify-center">
              <CartIcon className="w-5 h-5 mr-2 text-gray-400" />
              <span>Giỏ hàng đang trống</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLeft;
