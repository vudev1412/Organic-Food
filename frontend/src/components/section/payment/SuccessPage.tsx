import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircleFilled,
  CarOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  PrinterOutlined,
  HomeOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Spin, Result, Button, Divider, Tag } from "antd";
import dayjs from "dayjs";
import { getOrderByIdV2API } from "../../../service/api";
import { formatCurrency } from "../../../utils/format";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<IResOrderDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await getOrderByIdV2API(Number(orderId));
        if (res.data && res.data.data) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải hóa đơn..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Result
          status="404"
          title="Không tìm thấy đơn hàng"
          subTitle="Đơn hàng không tồn tại hoặc bạn không có quyền truy cập."
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* --- HEADER: SUCCESS STATUS --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          <CheckCircleFilled className="text-6xl text-green-500 mb-4 animate-bounce-in drop-shadow-md" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-500 mb-4">
            Cảm ơn bạn đã mua sắm. Mã đơn hàng của bạn là{" "}
            <span className="font-bold text-gray-900">#{order.id}</span>
          </p>

          <div className="flex justify-center gap-3">
            <Button
              type="primary"
              size="large"
              className="bg-green-600 hover:bg-green-700 font-semibold px-8 h-12 flex items-center gap-2 rounded-xl shadow-lg shadow-green-200"
              onClick={() => navigate("/")}
            >
              <HomeOutlined /> Tiếp tục mua sắm
            </Button>
            <Button
              size="large"
              className="px-6 h-12 flex items-center gap-2 rounded-xl border-gray-300 text-gray-600 hover:text-green-600 hover:border-green-600"
              onClick={() => navigate("/tai-khoan/lich-su-mua-hang")}
            >
              <HistoryOutlined /> Đơn hàng của tôi
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT COLUMN (Chi tiết đơn hàng) --- */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. THÔNG TIN GIAO HÀNG & THANH TOÁN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <CarOutlined className="text-green-600 text-lg" />
                <h3 className="font-bold text-gray-800 text-lg m-0">
                  Thông tin nhận hàng
                </h3>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wider">
                    Người nhận
                  </p>
                  <p className="font-semibold text-gray-900 text-base">
                    {order.receiverName}
                  </p>
                  <p className="text-gray-500">{order.receiverPhone}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wider">
                    Thanh toán
                  </p>
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCardOutlined className="text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {order.paymentMethod === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : "Chuyển khoản ngân hàng"}
                    </span>
                  </div>
                  <Tag
                    color={
                      order.paymentStatus === "PAID" ? "success" : "warning"
                    }
                    className="font-semibold"
                  >
                    {order.paymentStatus === "PAID"
                      ? "ĐÃ THANH TOÁN"
                      : "CHƯA THANH TOÁN"}
                  </Tag>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wider">
                    Địa chỉ giao hàng
                  </p>
                  <div className="flex items-start gap-2">
                    <EnvironmentOutlined className="text-gray-400 mt-1" />
                    <p className="text-gray-700 leading-relaxed">
                      {order.shipAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DANH SÁCH SẢN PHẨM */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <ShoppingOutlined className="text-green-600 text-lg" />
                <h3 className="font-bold text-gray-800 text-lg m-0">
                  Sản phẩm ({order.orderDetails.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-50">
                {order.orderDetails.map((item, index) => (
                  <div
                    key={index}
                    className="p-6 flex gap-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white group-hover:shadow-md transition-all">
                      <img
                        src={
                          item.productImage
                            ? `${
                                import.meta.env.VITE_BACKEND_URL
                              }/storage/images/products/${item.productImage}`
                            : "https://placehold.co/100"
                        }
                        alt={item.productName}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {item.productName}
                        </h4>
                        <p className="ml-4 text-base font-bold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-gray-500 font-medium">
                          Số lượng:{" "}
                          <span className="text-gray-900 font-bold">
                            x{item.quantity}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Tổng kết tiền & Action) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* CARD TỔNG KẾT */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <FileTextOutlined className="text-green-600" />
                Chi tiết thanh toán
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế GTGT (8%)</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.taxAmount)}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg">
                    <span className="font-semibold">Voucher giảm giá</span>
                    <span className="font-bold">
                      -{formatCurrency(order.discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              <Divider className="my-6 border-dashed" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-base font-bold text-gray-700">
                  Tổng cộng
                </span>
                <span className="text-3xl font-extrabold text-red-600 tracking-tight">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>

              {/* PRINT BUTTON */}
              <Button
                block
                size="large"
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
                className="h-12 rounded-xl border-dashed border-2 border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-400 font-medium"
              >
                In hóa đơn
              </Button>
            </div>

            {/* CARD LIÊN HỆ HỖ TRỢ (Optional) */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
              <p className="text-blue-800 font-semibold mb-1">Cần hỗ trợ?</p>
              <p className="text-blue-600 text-sm mb-3">
                Liên hệ hotline +84 800 456 478 để được giải đáp
              </p>  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
