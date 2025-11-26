// File path: /src/pages/client/sale.tsx

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FireOutlined,
  GiftOutlined,
  TagOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  FilterOutlined,
  CopyOutlined, // Đã thêm icon Copy
} from "@ant-design/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Hãy đảm bảo đường dẫn import API này đúng với dự án của bạn
import { getAvailableVouchersAPI } from "../../service/api";
import salebanner from "../../assets/jpg/sale_banner.jpg";

// --- 1. DEFINITIONS & INTERFACES ---

export interface IBackendRes<T> {
  data: T;
  message?: string;
  status?: number;
}

export type VoucherType = "PERCENT" | "FIXED_AMOUNT" | "FREESHIP";

export interface IResVoucherDTO {
  id: number;
  code: string;
  description?: string;
  typeVoucher: VoucherType;
  value: number;
  maxDiscountAmount: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  quantity: number;
  usedCount: number;
  active: boolean;
}

// --- UTILS ---
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- HOOK: useInterval ---
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// --- COMPONENT: ProductCard (Giữ nguyên) ---
const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const savings = product.originalPrice - product.promotionPrice;
  return (
    <Link
      to={`/san-pham/${product.slug}`}
      state={{ productId: product.id }}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {savings > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            Giảm {formatCurrency(savings)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-lg line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-red-600">
            {formatCurrency(product.promotionPrice)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatCurrency(product.originalPrice)}
          </span>
        </div>
        <button className="mt-3 w-full bg-green-50 text-green-700 py-2 rounded-lg font-medium border border-green-200 hover:bg-green-100 transition-colors">
          Xem chi tiết
        </button>
      </div>
    </Link>
  );
};

// --- COMPONENT: VoucherCard (Compact & Icon Copy) ---
const VoucherCard: React.FC<{ promo: IResVoucherDTO }> = ({ promo }) => {
  const { color, icon, name } = useMemo(() => {
    switch (promo.typeVoucher) {
      case "PERCENT":
        return { color: "red", icon: <TagOutlined />, name: "Giảm Giá %" };
      case "FIXED_AMOUNT":
        return { color: "green", icon: <GiftOutlined />, name: "Giảm Tiền" };
      case "FREESHIP":
        return { color: "blue", icon: <FireOutlined />, name: "FreeShip" };
      default:
        return { color: "gray", icon: <GiftOutlined />, name: "Ưu Đãi" };
    }
  }, [promo.typeVoucher]);

  const renderValue = () => {
    switch (promo.typeVoucher) {
      case "PERCENT":
        return `Giảm ${promo.value}%`;
      case "FIXED_AMOUNT":
        return `Giảm ${formatCurrency(promo.value)}`;
      case "FREESHIP":
        return "Miễn Phí Ship";
      default:
        return "Ưu đãi";
    }
  };

  const colorClasses: any = {
    blue: {
      text: "text-blue-700",
      bgLight: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    red: {
      text: "text-red-700",
      bgLight: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
    },
    green: {
      text: "text-green-700",
      bgLight: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
    },
    gray: {
      text: "text-gray-700",
      bgLight: "bg-gray-50",
      border: "border-gray-200",
      iconBg: "bg-gray-100",
    },
  };

  const classes = colorClasses[color] || colorClasses.gray;

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.code);
    alert(`Đã sao chép mã: ${promo.code}`);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-100 p-3 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex-shrink-0 w-full snap-center sm:w-[280px]`}
    >
      {/* Header Compact */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`text-xl ${classes.text} ${classes.iconBg} p-2 rounded-lg shrink-0`}
        >
          {icon}
        </div>
        <div className="overflow-hidden">
          <h3
            className={`text-base font-bold ${classes.text} leading-tight truncate`}
          >
            {renderValue()}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
            {promo.description || name}
          </p>
        </div>
      </div>

      {/* Phần Code và Copy Icon */}
      <div className="mt-1 pt-2 border-t border-dashed border-gray-200">
        <div
          className={`${classes.bgLight} p-1.5 px-3 rounded-md flex items-center justify-between mb-2 border ${classes.border}`}
        >
          <span
            className={`text-sm font-black ${classes.text} tracking-wider font-mono`}
          >
            {promo.code}
          </span>

          {/* NÚT COPY DẠNG ICON */}
          <button
            onClick={handleCopy}
            title="Sao chép mã"
            className={`p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-green-600 active:scale-90`}
          >
            <CopyOutlined className="text-lg" />
          </button>
        </div>

        {/* Thông tin chi tiết (Font nhỏ, layout gọn) */}
        <div className="space-y-1 text-[10px] text-gray-500 font-medium">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircleFilled className="text-green-500 text-[10px]" /> Đơn
              tối thiểu:
            </span>
            <span className="text-gray-700 font-semibold">
              {formatCurrency(promo.minOrderValue)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ClockCircleOutlined className="text-orange-400 text-[10px]" />{" "}
              HSD:
            </span>
            <span>{new Date(promo.endDate).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: VoucherFilter ---
interface IVoucherFilterProps {
  currentFilter: VoucherType | "ALL";
  setFilter: (filter: VoucherType | "ALL") => void;
}

const VoucherFilter: React.FC<IVoucherFilterProps> = ({
  currentFilter,
  setFilter,
}) => {
  const filters: {
    label: string;
    value: VoucherType | "ALL";
    colorClass: string;
  }[] = [
    {
      label: "Tất Cả",
      value: "ALL",
      colorClass: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      label: "Phần Trăm",
      value: "PERCENT",
      colorClass: "bg-red-50 hover:bg-red-100 text-red-600",
    },
    {
      label: "Giảm Tiền",
      value: "FIXED_AMOUNT",
      colorClass: "bg-green-50 hover:bg-green-100 text-green-600",
    },
    {
      label: "FreeShip",
      value: "FREESHIP",
      colorClass: "bg-blue-50 hover:bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
      <div className="flex items-center gap-2 mr-2 text-gray-500">
        <FilterOutlined /> <span>Lọc:</span>
      </div>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setFilter(filter.value)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 border border-transparent ${
            filter.colorClass
          } ${
            currentFilter === filter.value
              ? "ring-2 ring-offset-2 ring-green-500 shadow-md transform scale-105"
              : "opacity-80 grayscale-[0.3] hover:grayscale-0"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// --- MAIN PAGE: SalePage ---
const SalePage: React.FC = () => {
  const [availableVouchers, setAvailableVouchers] = useState<IResVoucherDTO[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<VoucherType | "ALL">("ALL");

  // Refs & State cho Scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // 1. GỌI API
  useEffect(() => {
    const fetchVouchers = async () => {
      setIsLoading(true);
      try {
        const response = await getAvailableVouchersAPI();
        if (response.data && response.data.data) {
          setAvailableVouchers(response.data.data);
        } else if (Array.isArray(response.data)) {
          setAvailableVouchers(response.data as any);
        } else {
          setAvailableVouchers([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải vouchers:", error);
        setAvailableVouchers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const filteredVouchers = useMemo(() => {
    if (activeFilter === "ALL") return availableVouchers;
    return availableVouchers.filter((v) => v.typeVoucher === activeFilter);
  }, [availableVouchers, activeFilter]);

  // 2. XỬ LÝ SCROLL
  const ITEM_WIDTH = 300; // Đã điều chỉnh cho phù hợp với card compact mới

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -ITEM_WIDTH : ITEM_WIDTH,
        behavior: "smooth",
      });
    }
  };

  // 3. LOGIC LOOP SCROLL
  useInterval(() => {
    if (
      isPaused ||
      isLoading ||
      filteredVouchers.length <= 3 ||
      !scrollContainerRef.current
    ) {
      return;
    }

    const container = scrollContainerRef.current;
    const isAtEnd =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10;

    if (isAtEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scroll("right");
    }
  }, 3500);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const mockBanner = {
    name: "Siêu Sale Giữa Tháng",
    desc: "Săn mã giảm giá độc quyền ngay hôm nay!",
    image: salebanner,
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* --- HERO BANNER --- */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={mockBanner.image}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
          <div className="text-center text-white px-4 animate-fade-in-up">
            <span className="inline-block py-1 px-4 rounded-full bg-red-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg animate-pulse">
              <FireOutlined className="mr-1" /> Hot Deal
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
              {mockBanner.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {mockBanner.desc}
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("voucher-container")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-white text-green-700 font-bold rounded-full shadow-lg hover:bg-green-50 hover:scale-105 transition-all"
            >
              Săn Voucher Ngay
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* --- SECTION VOUCHER --- */}
        <section id="voucher-container" className="mb-20 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <TagOutlined className="text-green-600" /> Kho Voucher Của Bạn
            </h2>
            <p className="text-gray-500 mt-2">
              Lưu mã và sử dụng tại bước thanh toán
            </p>
          </div>

          <VoucherFilter
            currentFilter={activeFilter}
            setFilter={setActiveFilter}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
              <LoadingOutlined className="text-4xl text-green-600 mb-4" />
              <p className="text-gray-500">Đang tìm kiếm ưu đãi tốt nhất...</p>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <img
                src="https://placehold.co/200x200?text=No+Voucher"
                alt="Empty"
                className="mx-auto mb-4 opacity-50 h-32 w-32 object-contain"
              />
              <p className="text-gray-500 font-medium">
                Hiện chưa có voucher nào cho mục này.
              </p>
              <button
                onClick={() => setActiveFilter("ALL")}
                className="mt-4 text-green-600 font-semibold hover:underline"
              >
                Xem tất cả voucher
              </button>
            </div>
          ) : (
            <div
              className="relative group px-1"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* --- NÚT PREV (LUÔN HIỆN) --- */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white text-gray-600 shadow-lg rounded-full flex items-center justify-center border border-gray-100 hover:text-green-600 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              {/* --- SLIDER CONTAINER --- */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredVouchers.map((promo) => (
                  <VoucherCard key={promo.id} promo={promo} />
                ))}
              </div>

              {/* --- NÚT NEXT (LUÔN HIỆN) --- */}
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white text-gray-600 shadow-lg rounded-full flex items-center justify-center border border-gray-100 hover:text-green-600 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </section>

        {/* --- PRODUCT SUGGESTIONS --- */}
        {[
          {
            vId: 1,
            title: "Rau Củ Tươi",
            prods: [
              {
                id: 301,
                name: "Cải Kale Hữu Cơ",
                slug: "cai-kale",
                image: "https://placehold.co/300x300?text=Kale",
                originalPrice: 45000,
                promotionPrice: 35000,
              },
              {
                id: 302,
                name: "Cà Rốt Baby",
                slug: "ca-rot",
                image: "https://placehold.co/300x300?text=Carrot",
                originalPrice: 60000,
                promotionPrice: 50000,
              },
            ],
          },
          {
            vId: 2,
            title: "Thực Phẩm Khô",
            prods: [
              {
                id: 101,
                name: "Gạo Lứt ST25",
                slug: "gao-lut",
                image: "https://placehold.co/300x300?text=Rice",
                originalPrice: 120000,
                promotionPrice: 102000,
              },
              {
                id: 102,
                name: "Hạt Chia Úc",
                slug: "hat-chia",
                image: "https://placehold.co/300x300?text=Chia",
                originalPrice: 150000,
                promotionPrice: 135000,
              },
            ],
          },
        ].map((section) => {
          const relatedVoucher = availableVouchers.find(
            (v) => v.id === section.vId
          );
          if (
            !relatedVoucher ||
            (activeFilter !== "ALL" &&
              relatedVoucher.typeVoucher !== activeFilter)
          )
            return null;

          return (
            <section key={section.vId} className="mb-16 animate-fade-in">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-700">
                    <GiftOutlined className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Áp dụng mã:{" "}
                      <span className="font-bold text-red-500">
                        {relatedVoucher.code}
                      </span>
                    </p>
                  </div>
                </div>
                <Link
                  to="/san-pham"
                  className="text-green-600 font-medium hover:underline text-sm"
                >
                  Xem thêm &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {section.prods.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}

        {/* --- NEWSLETTER --- */}
        <div className="mt-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Đừng Bỏ Lỡ Ưu Đãi!</h3>
            <p className="mb-8 text-green-100">
              Đăng ký nhận tin để nhận mã giảm giá mới nhất gửi thẳng vào email
              của bạn hàng tuần.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 px-6 py-3 rounded-full text-gray-800 outline-none focus:ring-4 focus:ring-green-400/50"
              />
              <button className="bg-yellow-400 text-green-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors shadow-lg">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalePage;
