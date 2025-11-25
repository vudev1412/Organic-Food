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
} from "@ant-design/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- INTERFACE (Giữ nguyên) ---
type VoucherType = "PERCENT" | "FIXED_AMOUNT" | "FREESHIP";
interface IResVoucherDTO {
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

// Giả định Mock API và formatCurrency (Giữ nguyên)
const getAvailableVouchersAPI = () => {
  return Promise.resolve({
    data: {
      data: [
        {
          id: 1,
          code: "GIAM10PT",
          description: "Giảm 10% cho tất cả đơn hàng.",
          typeVoucher: "PERCENT" as VoucherType,
          value: 10,
          maxDiscountAmount: 50000,
          minOrderValue: 200000,
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          quantity: 100,
          usedCount: 10,
          active: true,
        },
        {
          id: 2,
          code: "FREESHIPMAX",
          description: "Miễn phí vận chuyển cho đơn hàng từ 150k.",
          typeVoucher: "FREESHIP" as VoucherType,
          value: 30000,
          maxDiscountAmount: 0,
          minOrderValue: 150000,
          startDate: "2023-01-01",
          endDate: "2023-11-30",
          quantity: 50,
          usedCount: 5,
          active: true,
        },
        {
          id: 3,
          code: "FIXED50K",
          description: "Giảm 50k cho đơn hàng từ 300k.",
          typeVoucher: "FIXED_AMOUNT" as VoucherType,
          value: 50000,
          maxDiscountAmount: 0,
          minOrderValue: 300000,
          startDate: "2023-01-01",
          endDate: "2023-12-25",
          quantity: 80,
          usedCount: 20,
          active: true,
        },
        {
          id: 4,
          code: "GIAM20PT",
          description: "Giảm 20% cho đơn hàng đầu tiên.",
          typeVoucher: "PERCENT" as VoucherType,
          value: 20,
          maxDiscountAmount: 80000,
          minOrderValue: 100000,
          startDate: "2023-01-01",
          endDate: "2023-11-20",
          quantity: 100,
          usedCount: 10,
          active: true,
        },
        {
          id: 5,
          code: "FREESHIPALL",
          description: "Miễn phí vận chuyển không giới hạn.",
          typeVoucher: "FREESHIP" as VoucherType,
          value: 50000,
          maxDiscountAmount: 0,
          minOrderValue: 0,
          startDate: "2023-01-01",
          endDate: "2024-01-01",
          quantity: 20,
          usedCount: 15,
          active: true,
        },
      ],
    },
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- HOOK CƠ BẢN CHO AUTO-SCROLL (Giữ nguyên) ---
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

// --- Component Card Sản Phẩm Khuyến Mãi (Giữ nguyên) ---
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

// --- Component Card Voucher (Đã tối ưu chiều rộng) ---
const VoucherCard: React.FC<{ promo: IResVoucherDTO }> = ({ promo }) => {
  // ... (useMemo, renderValue, colorClasses, classes giữ nguyên)
  const { color, icon, name } = useMemo(() => {
    switch (promo.typeVoucher) {
      case "PERCENT":
        return {
          color: "red",
          icon: <TagOutlined />,
          name: "Giảm Giá Phần Trăm",
        };
      case "FIXED_AMOUNT":
        return {
          color: "green",
          icon: <GiftOutlined />,
          name: "Giảm Giá Cố Định",
        };
      case "FREESHIP":
        return {
          color: "blue",
          icon: <FireOutlined />,
          name: "Miễn Phí Vận Chuyển",
        };
      default:
        return {
          color: "gray",
          icon: <GiftOutlined />,
          name: "Ưu Đãi Đặc Biệt",
        };
    }
  }, [promo.typeVoucher]);

  const renderValue = () => {
    switch (promo.typeVoucher) {
      case "PERCENT":
        return `Giảm ${promo.value}%`;
      case "FIXED_AMOUNT":
        return `Giảm ${formatCurrency(promo.value)}`;
      case "FREESHIP":
        return "Miễn Phí Vận Chuyển";
      default:
        return "Ưu đãi đặc biệt";
    }
  };

  const colorClasses = {
    blue: {
      text: "text-blue-700",
      bgLight: "bg-blue-100",
      bgDark: "bg-blue-600",
      border: "border-blue-200",
    },
    red: {
      text: "text-red-700",
      bgLight: "bg-red-100",
      bgDark: "bg-red-600",
      border: "border-red-200",
    },
    green: {
      text: "text-green-700",
      bgLight: "bg-green-100",
      bgDark: "bg-green-600",
      border: "border-green-200",
    },
    gray: {
      text: "text-gray-700",
      bgLight: "bg-gray-100",
      bgDark: "bg-gray-600",
      border: "border-gray-200",
    },
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <div
      key={promo.id}
      // Đã loại bỏ lg:w-1/3 để cố định chiều rộng (350px)
      className={`bg-white rounded-2xl shadow-xl border-l-4 ${classes.border} p-6 flex flex-col justify-between transition-transform hover:shadow-2xl duration-300 flex-shrink-0 w-full snap-center sm:w-[350px]`}
    >
      <div>
        <div className="flex items-start gap-3 mb-3">
          <div className={`text-4xl ${classes.text} flex-shrink-0 mt-1`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${classes.text} mb-1`}>
              {renderValue()}
            </h3>
            <p className="text-sm text-gray-500">
              {promo.description || `${name} hấp dẫn từ Organic Food.`}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
        <div
          className={`${classes.bgLight} p-3 rounded-lg flex items-center justify-between mb-4`}
        >
          <span
            className={`text-xl font-extrabold ${classes.text} tracking-wider`}
          >
            {promo.code}
          </span>
          <button
            onClick={() =>
              navigator.clipboard.writeText(promo.code).then(() => {
                alert(`Đã sao chép mã ${promo.code}!`);
              })
            }
            className={`text-sm ${classes.bgDark} text-white px-4 py-1.5 rounded-full hover:${classes.bgDark}/90 transition-colors shadow-md`}
          >
            Sao chép
          </button>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircleFilled className="text-green-500 mt-1 flex-shrink-0 text-base" />
            <span>
              Đơn tối thiểu: **{formatCurrency(promo.minOrderValue)}**
            </span>
          </li>

          {promo.typeVoucher === "PERCENT" && promo.maxDiscountAmount > 0 && (
            <li className="flex items-start gap-2">
              <CheckCircleFilled className="text-green-500 mt-1 flex-shrink-0 text-base" />
              <span>
                Giảm tối đa: **{formatCurrency(promo.maxDiscountAmount)}**
              </span>
            </li>
          )}

          <li className="flex items-start gap-2">
            <ClockCircleOutlined className="text-orange-500 mt-1 flex-shrink-0 text-base" />
            <span>
              HSD: **{new Date(promo.endDate).toLocaleDateString("vi-VN")}**
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// --- Component Bộ Lọc Voucher (Giữ nguyên) ---
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
      colorClass: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    },
    {
      label: "Phần Trăm (%)",
      value: "PERCENT",
      colorClass: "bg-red-100 hover:bg-red-200 text-red-700",
    },
    {
      label: "Cố Định (₫)",
      value: "FIXED_AMOUNT",
      colorClass: "bg-green-100 hover:bg-green-200 text-green-700",
    },
    {
      label: "Miễn Phí VC",
      value: "FREESHIP",
      colorClass: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-xl shadow-inner">
      <FilterOutlined className="text-xl text-gray-600 flex-shrink-0" />
      <span className="font-semibold text-gray-700 mr-2">Lọc theo loại:</span>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setFilter(filter.value)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            filter.colorClass
          } ${
            currentFilter === filter.value
              ? "ring-2 ring-offset-2 ring-current transform scale-105 shadow-md"
              : "opacity-70"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// --- Component Trang Khuyến Mãi Chính (Tăng cường hiệu ứng mượt mà) ---
const SalePage: React.FC = () => {
  const [availableVouchers, setAvailableVouchers] = useState<IResVoucherDTO[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<VoucherType | "ALL">("ALL");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // State quản lý auto-scroll
  const [isScrolling, setIsScrolling] = useState(false); // Theo dõi trạng thái cuộn thủ công
  const [autoScrollDirection, setAutoScrollDirection] = useState<"left" | "right">("right"); // Hướng cuộn tự động

  // FETCH VOUCHERS TỪ API (Giữ nguyên)
  useEffect(() => {
    const fetchVouchers = async () => {
      setIsLoading(true);
      try {
        const response = await getAvailableVouchersAPI();
        if (response.data && Array.isArray(response.data.data)) {
          setAvailableVouchers(response.data.data);
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
    if (activeFilter === "ALL") {
      return availableVouchers;
    }
    return availableVouchers.filter(
      (voucher) => voucher.typeVoucher === activeFilter
    );
  }, [availableVouchers, activeFilter]);

  // HÀM XỬ LÝ TRƯỢT
  // Đã điều chỉnh SCROLL_AMOUNT để phù hợp hơn với 350px + 1.5rem gap (24px) = 374px
  const SCROLL_AMOUNT = 374; 
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      setIsScrolling(true);
      // Tối ưu: Dùng 'smooth' behavior
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
        behavior: "smooth",
      });

      // Tăng thời gian timeout để phù hợp với độ mượt của smooth scroll, giúp tránh gián đoạn
      setTimeout(() => setIsScrolling(false), 600); 
    }
  };
  
  // LOGIC AUTO-SCROLL (Giữ nguyên)
  useInterval(() => {
    const container = scrollContainerRef.current;
    if (filteredVouchers.length > 3 && !isScrolling && container) {
      // Kiểm tra gần cuối/đầu để đảo chiều, tránh lỗi số học float
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      const isAtStart = container.scrollLeft <= 10;

      if (autoScrollDirection === "right") {
        if (isAtEnd) {
          setAutoScrollDirection("left");
          scroll("left");
        } else {
          scroll("right");
        }
      } else { // autoScrollDirection === "left"
        if (isAtStart) {
          setAutoScrollDirection("right");
          scroll("right");
        } else {
          scroll("left");
        }
      }
    }
  }, 4500); // Tăng thời gian chờ lên 4.5 giây để chuyển động mượt hơn (cho thời gian xem voucher)

  const mockPromotionsForBanner = [
    {
      id: 1,
      name: "Ưu Đãi Đặc Biệt Tháng 12",
      shortDesc: "Giảm giá sâu các sản phẩm hữu cơ tươi mới.",
      imageUrl:
        "https://placehold.co/800x400/e0f2f1/065f46?text=Promotion+Banner+1",
    },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* ================= 1. HERO BANNER SLIDER (Giữ nguyên) ================= */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${mockPromotionsForBanner[0].imageUrl})`,
            transition: "all 0.5s ease-in-out",
          }}
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-red-600/80 backdrop-blur-sm px-4 py-2 rounded-full mb-3 shadow-xl">
                <FireOutlined className="text-xl" />
                <span className="font-bold uppercase tracking-widest text-sm">
                  Ưu Đãi SỐC Hôm Nay
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                {mockPromotionsForBanner[0].name}
              </h1>
              <p className="text-xl text-gray-200 font-light mb-8">
                {mockPromotionsForBanner[0].shortDesc}
              </p>
              <Link
                to="#voucher-section"
                className="inline-block px-10 py-4 bg-green-600 text-white font-bold rounded-full text-lg shadow-lg shadow-green-400/50 hover:bg-green-700 transition-all transform hover:-translate-y-1"
              >
                Khám phá ngay &darr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-16 pb-20">
        {/* ================= 2. VOUCHER SECTION ================= */}
        <section id="voucher-section" className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              <TagOutlined className="text-green-600 mr-2" />
              Mã Giảm Giá Độc Quyền
            </h2>
            <p className="text-gray-600 text-lg">
              Sử dụng các mã này tại bước thanh toán để nhận ưu đãi!
            </p>
          </div>

          {/* Bộ lọc Voucher */}
          <VoucherFilter
            currentFilter={activeFilter}
            setFilter={setActiveFilter}
          />

          {isLoading ? (
            <div className="text-center p-10 bg-white rounded-xl shadow-lg">
              <LoadingOutlined className="text-3xl text-green-600" />
              <p className="mt-3 text-gray-600">Đang tải mã giảm giá...</p>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-xl shadow-lg">
              <p className="text-gray-600">
                Hiện chưa có mã giảm giá nào thuộc loại **{activeFilter}** còn
                hiệu lực.
              </p>
            </div>
          ) : (
            // FIX LỖI: Cập nhật padding ngang từ px-4 lên px-8 để tạo khoảng trống cho nút
            <div className="relative px-8 lg:px-16">
              {/* Nút Trái (Chỉ hiển thị nếu có thể cuộn) */}
              {filteredVouchers.length > 3 && (
                <button
                  onClick={() => scroll("left")}
                  className="
                    absolute left-1 top-1/2 -translate-y-1/2
                    z-20 p-2 bg-white shadow-lg rounded-full
                    transition-all duration-300
                    hover:bg-gray-100 hover:scale-110
                    lg:-left-3
                    hidden md:block 
                  "
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Danh sách Voucher (Ref Container) */}
              <div
                ref={scrollContainerRef}
                // Thêm transition-all duration-500 để tăng cường hiệu ứng cuộn mượt (nếu trình duyệt hỗ trợ)
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide transition-all duration-500"
              >
                {filteredVouchers.map((promo) => (
                  <VoucherCard key={promo.id} promo={promo} />
                ))}
              </div>

              {/* Nút Phải (Chỉ hiển thị nếu có thể cuộn) */}
              {filteredVouchers.length > 3 && (
                <button
                  onClick={() => scroll("right")}
                  className="
                    absolute right-1 top-1/2 -translate-y-1/2 
                    z-20 p-2 bg-white shadow-lg rounded-full
                    transition-all duration-300
                    hover:bg-gray-100 hover:scale-110
                    lg:right-1
                    hidden md:block
                  "
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          )}
        </section>

        {/* ================= 3 & 4. SẢN PHẨM THEO TỪNG KHUYẾN MÃI (Giữ nguyên mock) ================= */}
        {Object.entries({
          // Giả định voucher ID 1, 3 (FIXED_AMOUNT), 2 (FREESHIP) có sản phẩm áp dụng
          1: [
            {
              id: 101,
              name: "Trứng Gà Hữu Cơ",
              slug: "trung-ga",
              image: "https://placehold.co/250x250/fff/333?text=Egg",
              originalPrice: 75000,
              promotionPrice: 63750,
            },
            {
              id: 102,
              name: "Gạo Lứt ST25",
              slug: "gao-lut",
              image: "https://placehold.co/250x250/fff/333?text=Rice",
              originalPrice: 120000,
              promotionPrice: 102000,
            },
          ],
          3: [
            {
              id: 301,
              name: "Rau Cải Kale",
              slug: "rau-kale",
              image: "https://placehold.co/250x250/fff/333?text=Kale",
              originalPrice: 45000,
              promotionPrice: 35000,
            },
            {
              id: 302,
              name: "Cà Rốt Đà Lạt",
              slug: "ca-rot",
              image: "https://placehold.co/250x250/fff/333?text=Carrot",
              originalPrice: 60000,
              promotionPrice: 50000,
            },
          ],
        }).map(([promoId, products]) => {
          const promotion = availableVouchers.find(
            (p) => p.id === parseInt(promoId)
          );

          if (!promotion || products.length === 0) return null;

          if (activeFilter !== "ALL" && promotion.typeVoucher !== activeFilter)
            return null;

          return (
            <section key={promoId} className="mb-16">
              <div className="bg-green-800 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FireOutlined />
                  Sản phẩm áp dụng: {promotion.code}
                </h2>
                <Link
                  to="/san-pham"
                  className="text-sm font-semibold border-b border-green-400 hover:text-green-200 transition-colors"
                >
                  Xem tất cả &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white p-6 rounded-b-2xl shadow-xl">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}

        {/* ================= BOTTOM ACTION (Giữ nguyên) ================= */}
        <div className="text-center mt-20 p-8 bg-green-600 rounded-2xl shadow-lg">
          <h3 className="text-3xl font-bold text-white mb-3">
            Đừng bỏ lỡ bất kỳ ưu đãi nào!
          </h3>
          <p className="text-green-100 mb-6">
            Đăng ký nhận bản tin để được thông báo về các chương trình giảm giá
            mới nhất.
          </p>
          <div className="max-w-xl mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 px-5 py-3 rounded-full border-0 focus:ring-2 focus:ring-green-300 transition-all"
            />
            <button className="bg-white text-green-700 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalePage;