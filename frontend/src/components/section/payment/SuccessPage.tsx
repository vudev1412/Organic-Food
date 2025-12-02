import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ShoppingOutlined,
  PrinterOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Spin, Button, Divider, Tag, Card } from "antd";
import { getOrderByIdV2API } from "../../../service/api";
import { formatCurrency, formatOrderCode } from "../../../utils/format";

// Interface giữ nguyên
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa]">
        <Spin size="large" tip="Đang tải đơn hàng..." />
      </div>
    );
  }

  if (!order) {
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
  }

  const isCancelled = order.statusOrder === "CANCELLED";

  const getImageUrl = (productImage: string) => {
    const baseUrl =
      import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL ||
      "http://localhost:8080/storage/images/products/";
    return `${baseUrl}${productImage}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* --- HEADER SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 text-center border-t-4 border-green-500 relative overflow-hidden">
          {/* Background decoration bubble (optional) */}
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
              <CheckCircleFilled className="text-6xl text-green-500 mb-4 shadow-sm rounded-full bg-white" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Đặt hàng thành công!
              </h1>
              <p className="text-gray-500 text-lg">
                Cảm ơn bạn đã tin tưởng Organic Store. Mã đơn hàng của bạn là{" "}
                <span className="font-bold text-green-600 text-xl">
                  #{formatOrderCode(order.id)}
                </span>
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate("/san-pham")}
              className="hover:border-green-500 hover:text-green-600 rounded-xl h-10"
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<HistoryOutlined />}
              onClick={() => navigate("/tai-khoan/don-hang")}
              className="bg-green-600 hover:!bg-green-700 border-none shadow-green-200 shadow-lg rounded-xl h-10"
            >
              Quản lý đơn hàng
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* THÔNG TIN NHẬN HÀNG */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <EnvironmentOutlined className="text-green-600" />
                Thông tin nhận hàng
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
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">
                        {order.paymentMethod === "COD"
                          ? "Thanh toán khi nhận hàng (COD)"
                          : order.paymentMethod === "ONLINE"
                          ? "Chuyển khoản ngân hàng"
                          : order.paymentMethod}
                      </span>
                      <Tag
                        color={
                          order.paymentStatus === "SUCCESS"
                            ? "success"
                            : order.paymentStatus === "FAILED"
                            ? "error"
                            : "warning"
                        }
                        className="rounded-md px-2"
                      >
                        {order.paymentStatus === "SUCCESS"
                          ? "Đã thanh toán"
                          : order.paymentStatus === "FAILED"
                          ? "Thất bại"
                          : "Chưa thanh toán"}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <ShoppingOutlined className="text-green-600" />
                Sản phẩm đã đặt ({order.orderDetails.length})
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
                        alt={item.productName}
                        className="w-full h-full object-cover mix-blend-multiply"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-product.png";
                        }}
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

          {/* --- RIGHT COLUMN (SUMMARY) --- */}
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
                {/* YÊU CẦU: MÀU ĐỎ TO HƠN */}
                <span className="text-2xl sm:text-3xl font-bold text-red-600 leading-none">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>

              {!isCancelled && (
                <Button
                  block
                  icon={<PrinterOutlined />}
                  onClick={() => window.print()}
                  className="mt-6 h-11 rounded-xl border-dashed border-gray-300 text-gray-600 hover:text-green-600 hover:border-green-500 hover:bg-green-50"
                >
                  In hóa đơn
                </Button>
              )}
            </div>

            {/* Support Card */}
            <div className="bg-[#e6f4ea] rounded-2xl p-5 border border-green-100 text-center">
              <p className="text-green-800 font-semibold mb-1">
                Cần hỗ trợ đơn hàng?
              </p>
              <p className="text-sm text-green-700 mb-3">
                Đội ngũ chúng tôi luôn sẵn sàng 24/7
              </p>
              <a
                href="tel:+84800456478"
                className="text-lg font-bold text-green-700 hover:text-green-800 underline"
              >
                +84 800 456 478
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
