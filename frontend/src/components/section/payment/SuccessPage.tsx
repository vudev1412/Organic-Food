import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ShoppingOutlined,
  PrinterOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
  CreditCardOutlined, // Giữ lại CreditCardOutlined để dùng cho Payment Status
} from "@ant-design/icons";
import { Spin, Button, Tag, Divider } from "antd"; // Thêm Divider
import { getOrderByIdV2API } from "../../../service/api";
import { formatCurrency, formatOrderCode } from "../../../utils/format";

// Interface
interface OrderDetail {
  productId: number;
  productName: string;
  productImage: string;
  productSlug: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderAt: string;
  note: string;
  statusOrder: string;
  estimatedDate: string;
  actualDate: string | null;
  shipAddress: string;
  receiverName: string;
  receiverPhone: string;
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  orderDetails: OrderDetail[];
  userId: number | null;
}

// --- HELPER FUNCTIONS ---

// Helper: Lấy màu và text cho trạng thái Đơn hàng
const getStatusTag = (status: string) => {
  switch (status) {
    case "PENDING":
      return { color: "blue", text: "Chờ xác nhận" };
    case "CONFIRMED":
      return { color: "processing", text: "Đã xác nhận" };
    case "SHIPPING":
      return { color: "gold", text: "Đang giao hàng" };
    case "DELIVERED":
      return { color: "success", text: "Đã giao hàng" };
    case "CANCELLED":
      return { color: "error", text: "Đã hủy" };
    default:
      return { color: "default", text: status };
  }
};

// Helper: Lấy màu và text cho trạng thái Thanh toán
const getPaymentStatusTag = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return { color: "green", text: "Đã thanh toán" };
    case "PENDING":
      return { color: "volcano", text: "Chưa thanh toán" };
    case "FAILED":
      return { color: "red", text: "Thất bại" };
    default:
      return { color: "default", text: status };
  }
};

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await getOrderByIdV2API(Number(orderId));
        if (res?.data?.data) {
          setOrder(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // --- HÀM XỬ LÝ IN ẤN (ĐÃ CẬP NHẬT CSS & LOGO) ---
  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-content");
    if (!printContent || !order) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Hóa đơn #${formatOrderCode(order.id)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            
            /* Reset & Base */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              font-size: 14px; 
              color: #1a1a1a; 
              background: #fff; 
              padding: 20px;
            }
            
            /* Layout Wrapper */
            .invoice-wrapper {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e5e7eb;
              padding: 40px;
            }

            /* Header Section */
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              border-bottom: 2px solid #013a1e;
              padding-bottom: 20px;
            }
            
            .brand-section {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            }

            .logo-img {
              height: 80px;
              width: auto;
              object-fit: contain;
              margin-bottom: 10px;
            }

            .company-name {
              font-size: 24px;
              font-weight: 800;
              color: #013a1e;
              text-transform: uppercase;
              letter-spacing: -0.5px;
            }
            
            .invoice-title-block {
              text-align: right;
            }
            
            .invoice-big-text {
              font-size: 32px;
              font-weight: 900;
              color: #013a1e;
              text-transform: uppercase;
              line-height: 1;
              margin-bottom: 5px;
            }
            
            .invoice-ref {
              font-size: 14px;
              color: #6b7280;
            }

            /* Info Grid (Company & Customer) */
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 30px;
            }
            
            .info-column h3 {
              font-size: 12px;
              font-weight: 700;
              color: #013a1e;
              text-transform: uppercase;
              margin-bottom: 10px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            
            .info-text {
              font-size: 13px;
              line-height: 1.6;
              color: #374151;
            }
            
            .info-text strong {
              color: #111827;
              font-weight: 600;
            }

            /* Order Meta (Date, Payment, Status) */
            .meta-bar {
              background-color: #f0fdf4;
              border: 1px solid #dcfce7;
              border-radius: 6px;
              padding: 15px 20px;
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            
            .meta-item {
              display: flex;
              flex-direction: column;
              text-align: center; /* Căn giữa cho Meta Bar */
            }
            
            .meta-item:first-child { text-align: left; }
            .meta-item:last-child { text-align: right; }
            
            .meta-label {
              font-size: 11px;
              text-transform: uppercase;
              color: #166534;
              font-weight: 600;
              margin-bottom: 2px;
            }
            
            .meta-value {
              font-weight: 700;
              color: #14532d;
            }
            .meta-value.status-error { color: #dc2626; } /* Thêm style cho trạng thái hủy/lỗi */


            /* Table */
            .products-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            .products-table th {
              background: #013a1e;
              color: #fff;
              text-align: left;
              padding: 12px 10px;
              font-size: 12px;
              text-transform: uppercase;
              font-weight: 600;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .products-table td {
              padding: 12px 10px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
              color: #1f2937;
            }
            
            .col-center { text-align: center; }
            .col-right { text-align: right; }
            
            /* Summary Section */
            .summary-container {
              display: flex;
              justify-content: flex-end;
            }
            
            .summary-box {
              width: 300px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              font-size: 13px;
              color: #4b5563;
            }
            
            .summary-row.total {
              border-top: 2px solid #013a1e;
              margin-top: 10px;
              padding-top: 10px;
              font-size: 16px;
              font-weight: 800;
              color: #b91c1c; /* Đổi màu tổng tiền cho nổi bật */
            }

            /* Footer */
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
              border-top: 1px dashed #e5e7eb;
              padding-top: 20px;
            }
            
            .footer p { margin-bottom: 4px; }

            /* Print Specifics */
            @media print {
              body { padding: 0; background: white; }
              .invoice-wrapper { border: none; padding: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    // Tăng thời gian chờ một chút để đảm bảo ảnh logo kịp tải
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 800);
  };

  // --- Helpers ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa]">
        <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
      </div>
    );

  if (!order)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8f9fa]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
          <CloseCircleFilled className="text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-500 mb-6">
            Đơn hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 border-none"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );

  const isCancelled = order.statusOrder === "CANCELLED";
  const getImageUrl = (productImage: string) =>
    `${
      import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL ||
      "http://localhost:8080/storage/images/products/"
    }${productImage}`;

  const statusOrderTag = getStatusTag(order.statusOrder);
  const paymentStatusTag = getPaymentStatusTag(order.paymentStatus);

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* HEADER SECTION - Web View */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 text-center border-t-4 border-green-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-green-50 rounded-full opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-24 h-24 bg-yellow-50 rounded-full opacity-50 pointer-events-none"></div>

          {isCancelled ? (
            <>
              <CloseCircleFilled className="text-6xl text-red-500 mb-4 shadow-sm rounded-full bg-white" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Đơn hàng đã hủy
              </h1>
              <p className="text-gray-600 text-lg">
                Mã đơn hàng:{" "}
                <span className="font-bold text-gray-800">
                  #{formatOrderCode(order.id)}
                </span>
              </p>
              {order.note && (
                <p className="mt-2 text-red-500 bg-red-50 inline-block px-3 py-1 rounded-lg">
                  Lý do: {order.note}
                </p>
              )}
            </>
          ) : (
            <>
              <CheckCircleFilled className="text-6xl text-green-600 mb-4 shadow-sm rounded-full bg-white" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Đặt hàng thành công!
              </h1>
              <p className="text-gray-500 text-lg">
                Cảm ơn bạn đã tin tưởng Organic Food. Mã đơn hàng của bạn là{" "}
                <span className="font-bold text-green-700 text-xl">
                  #{formatOrderCode(order.id)}
                </span>
              </p>
              <div className="mt-2 flex justify-center items-center">
                <span className="text-gray-600 mr-2">Trạng thái hiện tại:</span>
                <Tag
                  color={statusOrderTag.color}
                  className="rounded-md px-2 py-1 text-sm font-semibold"
                >
                  {statusOrderTag.text}
                </Tag>
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate("/san-pham")}
              className="hover:border-green-600 hover:text-green-700 rounded-xl h-10"
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<HistoryOutlined />}
              onClick={() => navigate("/tai-khoan/don-hang")}
              className="bg-green-800 hover:!bg-green-900 border-none shadow-green-200 shadow-lg rounded-xl h-10"
            >
              Quản lý đơn hàng
            </Button>
          </div>
        </div>

        {/* CONTENT GRID - Web View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* THÔNG TIN CHUNG VÀ TRẠNG THÁI */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <HistoryOutlined className="text-green-700" /> Chi tiết giao
                dịch
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center p-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                    Mã đơn hàng
                  </span>
                  <span className="text-base font-bold text-green-700">
                    #{formatOrderCode(order.id)}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                    Ngày đặt
                  </span>
                  <span className="text-base font-medium text-gray-800">
                    {formatDate(order.orderAt)}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                    Trạng thái
                  </span>
                  <Tag
                    color={statusOrderTag.color}
                    className="rounded-md px-2 py-1 text-sm font-semibold"
                  >
                    {statusOrderTag.text}
                  </Tag>
                </div>
                <div className="flex flex-col items-center p-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                    Thanh toán
                  </span>
                  <Tag
                    color={paymentStatusTag.color}
                    className="rounded-md px-2 py-1 text-sm font-semibold"
                  >
                    {paymentStatusTag.text}
                  </Tag>
                </div>
              </div>
            </div>

            {/* THÔNG TIN NHẬN HÀNG */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <EnvironmentOutlined className="text-green-700" /> Thông tin
                nhận hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <UserOutlined className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                        Người nhận
                      </p>
                      <p className="text-base font-medium text-gray-800">
                        {order.receiverName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneOutlined className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                        Điện thoại
                      </p>
                      <p className="text-base font-medium text-gray-800">
                        {order.receiverPhone}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3">
                    <HomeOutlined className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                        Địa chỉ giao hàng
                      </p>
                      <p className="text-base text-gray-700 leading-relaxed">
                        {order.shipAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                <div className="flex items-start gap-3">
                  <CreditCardOutlined className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                      Phương thức thanh toán
                    </p>
                    <span className="font-medium text-gray-800">
                      {order.paymentMethod === "COD"
                        ? "Thanh toán khi nhận hàng (COD)"
                        : order.paymentMethod === "ONLINE"
                        ? "Chuyển khoản ngân hàng"
                        : order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <ShoppingOutlined className="text-green-700" /> Sản phẩm đã đặt
                ({order.orderDetails.length})
              </h2>
              <div className="space-y-6">
                {order.orderDetails.map((item, index) => (
                  <div
                    key={item.productId || index}
                    className="flex gap-4 sm:gap-6"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <img
                        src={getImageUrl(item.productImage)}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-product.png";
                        }}
                        className="w-full h-full object-cover mix-blend-multiply"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-medium text-gray-800 text-base sm:text-lg line-clamp-2">
                          {item.productName}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Đơn giá: {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                          x{item.quantity}
                        </span>
                        <span className="font-bold text-gray-800 text-base">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (SUMMARY) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                Chi tiết thanh toán
              </h2>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {formatCurrency(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế (VAT)</span>
                  <span className="font-medium">
                    {formatCurrency(order.taxAmount)}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 px-2 py-1 rounded-md -mx-2">
                    <span>Giảm giá</span>
                    <span className="font-medium">
                      - {formatCurrency(order.discountAmount)}
                    </span>
                  </div>
                )}
              </div>
              <div className="my-5 border-t border-dashed border-gray-300"></div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-gray-500 text-sm">Tổng thanh toán</span>
                <span className="text-2xl sm:text-3xl font-bold text-red-600 leading-none">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>

              {!isCancelled && (
                <Button
                  block
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  className="mt-6 h-11 rounded-xl border-dashed border-gray-300 text-gray-600 hover:text-green-700 hover:border-green-600 hover:bg-green-50"
                >
                  In hóa đơn ngay
                </Button>
              )}
            </div>

            {/* Support Card */}
            <div className="bg-[#e6f4ea] rounded-2xl p-5 border border-green-100 text-center">
              <p className="text-green-800 font-semibold mb-1">
                Cần hỗ trợ đơn hàng?
              </p>
              <p className="text-sm text-green-700 mb-3">
                Liên hệ ngay với Organic Food
              </p>
              <a
                href="tel:+84800456478"
                className="text-lg font-bold text-green-800 hover:underline"
              >
                +84 800 456 478
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN HÓA ĐƠN ẨN (Dữ liệu khớp với hình ảnh) --- */}
      {/* Đây là phần được in ra giấy */}
      <div style={{ display: "none" }}>
        <div id="invoice-print-content">
          <div className="invoice-wrapper">
            {/* Header: Logo và tên công ty */}
            <div className="header-container">
              <div className="brand-section">
                <img
                  src="/src/assets/png/logo.png"
                  alt="Logo"
                  className="logo-img"
                />
                <div className="company-name">Organic Food</div>
              </div>
              <div className="invoice-title-block">
                <div className="invoice-big-text">HÓA ĐƠN</div>
                <div className="invoice-ref">#{formatOrderCode(order.id)}</div>
              </div>
            </div>

            {/* Thông tin 2 cột */}
            <div className="info-grid">
              <div className="info-column">
                <h3>Nhà cung cấp</h3>
                <div className="info-text">
                  <strong>CÔNG TY TNHH ORGANIC FOOD</strong>
                  <br />
                  123 Đinh Tiên Hoàng, Đa Kao, Q.1
                  <br />
                  TP. Hồ Chí Minh, Việt Nam
                  <br />
                  Hotline: 0800 456 478
                  <br />
                  Email: organicfood@hotro.com
                </div>
              </div>
              <div className="info-column" style={{ textAlign: "right" }}>
                <h3>Khách hàng</h3>
                <div className="info-text">
                  <strong>{order.receiverName}</strong>
                  <br />
                  {order.receiverPhone}
                  <br />
                  <span style={{ display: "inline-block", maxWidth: "250px" }}>
                    {order.shipAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Thanh thông tin phụ - CẬP NHẬT: Thêm Trạng thái đơn hàng */}
            <div className="meta-bar">
              <div className="meta-item">
                <span className="meta-label">Ngày đặt hàng</span>
                <span className="meta-value">{formatDate(order.orderAt)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Trạng thái đơn hàng</span>
                <span
                  className={`meta-value ${isCancelled ? "status-error" : ""}`}
                >
                  {statusOrderTag.text}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Phương thức thanh toán</span>
                <span className="meta-value">
                  {order.paymentMethod === "COD"
                    ? "Tiền mặt (COD)"
                    : order.paymentMethod}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Trạng thái thanh toán</span>
                <span
                  className={`meta-value ${
                    paymentStatusTag.color === "red" ? "status-error" : ""
                  }`}
                >
                  {paymentStatusTag.text}
                </span>
              </div>
            </div>

            {/* Bảng sản phẩm */}
            <table className="products-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }} className="col-center">
                    STT
                  </th>
                  <th>Mô tả sản phẩm</th>
                  <th style={{ width: "80px" }} className="col-center">
                    SL
                  </th>
                  <th style={{ width: "120px" }} className="col-right">
                    Đơn giá
                  </th>
                  <th style={{ width: "140px" }} className="col-right">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.orderDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="col-center">{index + 1}</td>
                    <td>
                      <strong>{item.productName}</strong>
                    </td>
                    <td className="col-center">{item.quantity}</td>
                    <td className="col-right">{formatCurrency(item.price)}</td>
                    <td className="col-right" style={{ fontWeight: 600 }}>
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tổng tiền */}
            <div className="summary-container">
              <div className="summary-box">
                <div className="summary-row">
                  <span>Tổng tiền hàng:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="summary-row">
                  <span>Thuế VAT:</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="summary-row" style={{ color: "#16a34a" }}>
                    <span>Giảm giá:</span>
                    <span>- {formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>TỔNG THANH TOÁN:</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <p>Cảm ơn quý khách đã mua sắm tại Organic Food!</p>
              <p>Nếu có thắc mắc, vui lòng liên hệ hotline: +84 800 456 478</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
