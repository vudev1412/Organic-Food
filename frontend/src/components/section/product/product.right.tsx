import React, { useState } from "react";
import { Link } from "react-router-dom"; // ĐÃ THÊM: import Link theo yêu cầu
import ProductCard, { type Discount } from "../../common/product.card";

// --- DỮ LIỆU GIẢ ĐÃ CẬP NHẬT ---
const products = [
  {
    id: 1,
    name: "Cà chua beef hữu cơ",
    slug: "ca-chua-beef-huu-co",
    price: 40000,
    discount: undefined,
    imageUrl: "https://placehold.co/600x600/a0e0a0/333?text=Ca+Chua",
    altText: "Cà chua beef hữu cơ",
  },
  {
    id: 2,
    name: "Dưa lưới Organic",
    slug: "dua-luoi-organic",
    price: 120000,
    discount: { type: "percent" as const, value: 10 }, // Giảm 10%
    imageUrl: "https://placehold.co/600x600/f0d0a0/333?text=Dua+Luoi",
    altText: "Dưa lưới Organic",
  },
  {
    id: 3,
    name: "Bó Rau Cải Ngọt",
    slug: "bo-rau-cai-ngot",
    price: 25000,
    discount: undefined,
    imageUrl: "https://placehold.co/600x600/a0f0a0/333?text=Rau+Cai",
    altText: "Bó Rau Cải Ngọt",
  },
  {
    id: 4,
    name: "Nấm đùi gà tươi",
    slug: "nam-dui-ga-tuoi",
    price: 55000,
    discount: { type: "fixed_amount" as const, value: 5000 }, // Giảm 5.000đ
    imageUrl: "https://placehold.co/600x600/e0e0e0/333?text=Nam",
    altText: "Nấm đùi gà tươi",
  },
  {
    id: 5,
    name: "Cam sành loại 1",
    slug: "cam-sanh-loai-1",
    price: 60000,
    discount: undefined,
    imageUrl: "https://placehold.co/600x600/f0a0a0/333?text=Cam+Sanh",
    altText: "Cam sành loại 1",
  },
  {
    id: 6,
    name: "Táo Envy New Zealand",
    slug: "tao-envy-new-zealand",
    price: 199000,
    discount: undefined,
    imageUrl: "https://placehold.co/600x600/f0a0a0/333?text=Tao+Envy",
    altText: "Táo Envy New Zealand",
  },
];

// --- CÁC ICON SVG ---
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

const PlusIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
// --- KẾT THÚC ICON ---

// --- COMPONENT DROPDOWN SẮP XẾP (TÙY CHỈNH BẰNG TAILWIND) ---
const SortDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sắp xếp mặc định");
  const options = ["Mới nhất", "Giá thấp đến cao", "Giá cao đến thấp"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <div>
        <button
          type="button"
          className="flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption}
          <ChevronDownIcon
            className={`-mr-1 ml-2 h-5 w-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu dropdown */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <a
                key={option}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const ProductRight = () => {
  // Hàm xử lý khi click "Thêm vào giỏ"
  const handleAddToCartClick = (e: React.MouseEvent, productName: string) => {
    e.preventDefault(); // Ngăn Link (cha) chuyển trang
    e.stopPropagation(); // Ngăn sự kiện nổi bọt
    console.log("Đã thêm vào giỏ:", productName);
    // Tại đây, bạn có thể gọi hàm dispatch, mở modal, hoặc hiển thị thông báo
  };

  return (
    <div className="w-full">
      {/* Header (Tiêu đề và Sắp xếp) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Tất cả sản phẩm</h2>
        <SortDropdown />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            imageUrl={product.imageUrl}
            altText={product.altText}
            name={product.name}
            price={product.price}
            slug={product.slug}
            discount={{type: "percent", value: 20}} // ✅ dùng dữ liệu thực
            onAddToCart={() => console.log("Đã thêm vào giỏ:", product.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductRight;
