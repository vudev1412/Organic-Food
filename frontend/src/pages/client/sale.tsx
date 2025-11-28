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
  CopyOutlined, // Giữ lại icon Copy
} from "@ant-design/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
// API (Cần giữ lại đường dẫn import này)
import { getAvailableVouchersAPI } from "../../service/api";
import salebanner from "../../assets/jpg/sale_banner.jpg";
import axios from "axios";

// Components đã tách ra (theo file thứ 2)
import ProductCard from "../../components/common/product.card";
import QuantityModal from "../../components/section/product/QuantityModal";
import { useCurrentApp } from "../../components/context/app.context";

// --- 1. INTERFACES VÀ TYPES (Tối ưu từ cả 2 file) ---

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

export interface IDiscount {
  type: "PERCENT" | "FIXED_AMOUNT";
  value: number;
}

export interface IProductCard {
  id: number;
  name: string;
  slug: string;
  // Cần thêm imageUrl/imagePath tùy theo ProductCard component nhận prop gì
  imageUrl: string; // Sử dụng imageUrl để nhất quán với file thứ 2
  altText?: string;
  price: number; // originalPrice
  quantity: number; // stock quantity
  discount?: IDiscount;
}

interface IPromotion {
  id: number;
  name: string;
  active: boolean;
}

// --- 2. UTILS ---

// Giữ lại vì không được import từ nơi khác
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Giữ lại Hook useInterval vì là logic nội bộ
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

// --- 3. VOUCHER COMPONENTS (Giữ lại vì không được import) ---

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

// --- 4. MAIN PAGE: SalePage (Tối ưu hóa logic API và Product Card) ---
const SalePage: React.FC = () => {
  const { addToCart } = useCurrentApp();

  // ------------------
  // Quantity Modal State
  // ------------------
  const [selectedProduct, setSelectedProduct] = useState<IProductCard | null>(
    null
  );
  const [selectedDiscount, setSelectedDiscount] = useState<IDiscount>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mở modal, nhận ProductCard object đã được ánh xạ
  const openModal = (p: IProductCard, discount?: IDiscount) => {
    setSelectedProduct(p);
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmAdd = (product: IProductCard, quantity: number) => {
    // ProductCard từ QuantityModal đã bao gồm discount trong prop
    addToCart(product, quantity);
    closeModal();
  };

  // ------------------
  // Promotions + Products State & Fetching
  // ------------------
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [promoProducts, setPromoProducts] =
    useState<{ promotion: IPromotion; items: IProductCard[] }[]>();
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchPromotions = async () => {
    try {
      const res = await axios.get("/api/v1/promotions");
      setPromotions(res.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải promotions:", error);
      setPromotions([]);
    }
  };

  const fetchPromoProducts = async (allPromotions: IPromotion[]) => {
    setIsLoadingProducts(true);
    const active = allPromotions.filter((p) => p.active);

    const result: { promotion: IPromotion; items: IProductCard[] }[] = [];

    for (const promo of active) {
      try {
        const api = `/api/v1/products/promotion/${promo.id}?page=1&size=50`;
        const res = await axios.get(api);

        // DTO từ API: Giữ nguyên cấu trúc ánh xạ của file thứ 2
        const items: any[] = res.data.data.result;

        const mapped: IProductCard[] = items.map((p) => ({
          id: p.productId,
          name: p.productName,
          slug: p.slug,
          imageUrl: `/images/${p.image}`,
          altText: p.productName,
          price: p.originalPrice, // originalPrice
          quantity: p.quantity, // stock quantity
          discount: {
            type: p.promotionType,
            value: p.promotionValue,
          },
        }));

        result.push({ promotion: promo, items: mapped });
      } catch (error) {
        console.error(`Lỗi khi tải sản phẩm cho KM ${promo.id}:`, error);
        // Bỏ qua nếu có lỗi
      }
    }

    setPromoProducts(result);
    setIsLoadingProducts(false);
  };

  // 1. Fetch Promotions ban đầu
  useEffect(() => {
    fetchPromotions();
  }, []);

  // 2. Fetch Products khi Promotions thay đổi
  useEffect(() => {
    if (promotions.length > 0) {
      fetchPromoProducts(promotions);
    } else if (promotions.length === 0 && promoProducts) {
      setPromoProducts(undefined); // Reset nếu không có KM nào
    }
  }, [promotions]); // Chỉ chạy khi danh sách promotions được set

  // ------------------
  // VOUCHER LOGIC
  // ------------------
  const [availableVouchers, setAvailableVouchers] = useState<IResVoucherDTO[]>(
    []
  );
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);
  const [activeFilter, setActiveFilter] = useState<VoucherType | "ALL">("ALL");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // load vouchers
  useEffect(() => {
    const loadVoucher = async () => {
      setIsLoadingVouchers(true);
      try {
        const res = await getAvailableVouchersAPI();
        // Xử lý dữ liệu trả về theo 2 kiểu có thể (của file gốc)
        const data = res.data.data || res.data;
        setAvailableVouchers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải vouchers:", err);
        setAvailableVouchers([]);
      } finally {
        setIsLoadingVouchers(false);
      }
    };
    loadVoucher();
  }, []);

  const filteredVouchers = useMemo(() => {
    if (activeFilter === "ALL") return availableVouchers;
    return availableVouchers.filter((v) => v.typeVoucher === activeFilter);
  }, [availableVouchers, activeFilter]);

  const ITEM_WIDTH = 300;
  const scroll = (dir: "left" | "right") => {
    scrollContainerRef.current?.scrollBy({
      left: dir === "left" ? -ITEM_WIDTH : ITEM_WIDTH,
      behavior: "smooth",
    });
  };

  // AUTO SCROLL
  useInterval(() => {
    if (
      isPaused ||
      isLoadingVouchers || // Thêm check loading
      filteredVouchers.length <= 3 ||
      !scrollContainerRef.current
    )
      return;

    const c = scrollContainerRef.current;
    if (c.scrollLeft + c.clientWidth >= c.scrollWidth - 10) {
      c.scrollTo({ left: 0, behavior: "smooth" });
    } else scroll("right");
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

          {isLoadingVouchers ? (
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

        {/* =============================================================
        🟢 KHỐI SẢN PHẨM THEO KHUYẾN MÃI 🟢
       ============================================================= */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <GiftOutlined className="text-green-600" /> Sản phẩm đang khuyến mãi
          </h2>

          {isLoadingProducts && (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl shadow-sm">
              <LoadingOutlined className="text-3xl text-green-600 mb-2" />
              <p className="text-gray-500">Đang tải danh sách sản phẩm...</p>
            </div>
          )}

          {!isLoadingProducts &&
            (!promoProducts || promoProducts.length === 0) && (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">
                  Hiện không có chương trình khuyến mãi nào đang diễn ra.
                </p>
              </div>
            )}

          {!isLoadingProducts &&
            promoProducts &&
            promoProducts.map((block) => {
              // Lọc các block KM không phù hợp với filter đang chọn
              const relatedVoucher = availableVouchers.find(
                (v) => v.code === block.promotion.name // Giả định Tên KM = Code Voucher
              );

              // Lọc chỉ hiển thị các block nếu filter đang được bật
              // (Sửa logic lọc của file gốc: Áp dụng filter voucher cho cả product section)
              if (
                activeFilter !== "ALL" &&
                relatedVoucher?.typeVoucher !== activeFilter
              ) {
                // Nếu không tìm thấy voucher liên quan hoặc voucher không khớp filter
                return null;
              }

              return (
                <div key={block.promotion.id} className="mb-16 animate-fade-in">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg text-green-700">
                        <GiftOutlined className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {block.promotion.name}
                        </h3>
                        {relatedVoucher && (
                          <p className="text-sm text-gray-500">
                            Áp dụng mã:{" "}
                            <span className="font-bold text-red-500">
                              {relatedVoucher.code}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/san-pham"
                      className="text-green-600 font-medium hover:underline text-sm"
                    >
                      Xem thêm &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {block.items.map((item) => (
                      // Đảm bảo ProductCard nhận đúng props
                      <ProductCard
                        key={item.id}
                        id={item.id}
                        imageUrl={item.imageUrl}
                        altText={item.altText || item.name}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        slug={item.slug}
                        discount={item.discount}
                        // Thêm onAddToCart cho ProductCard để mở modal
                        onAddToCart={() => openModal(item, item.discount)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </section>
      </div>

      {/* --- MODAL SỐ LƯỢNG GIỎ HÀNG --- */}
      {isModalOpen && selectedProduct && (
        <QuantityModal
          product={selectedProduct}
          discount={selectedDiscount}
          onClose={closeModal}
          onConfirm={handleConfirmAdd}
        />
      )}
    </div>
  );
};

export default SalePage;
