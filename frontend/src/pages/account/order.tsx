// File path: /src/pages/account/order.tsx

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  FileTextOutlined,
  RightOutlined,
  CloseOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Tag, Space, Typography, Button, message } from "antd";
import { useCurrentApp } from "../../components/context/app.context";
import { getOrderByUserId } from "../../service/api";


const { Text } = Typography;

// === ENUM & TYPES ===
export enum StatusOrder {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

interface IOrderDetail {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
}

interface IOrder {
  id: number;
  orderAt: string;
  note?: string;
  statusOrder: string;
  shipAddress: string;
  estimatedDate?: string;
  actualDate?: string;
  userId?: number;
  userName?: string;
  orderDetails?: IOrderDetail[];
}

// === HELPER ===
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
const calculateOrderTotal = (items: IOrderDetail[]) =>
  items.reduce((sum, item) => sum + item.price, 0);

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Giao thành công",
    CANCELLED: "Đã hủy",
  };
  return map[status] || status;
};

const getStatusStyles = (status: string) => {
  const map: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-700 border-orange-200",
    PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
    SHIPPING: "bg-indigo-100 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-300",
  };
  return map[status] || "bg-gray-100 text-gray-600 border-gray-200";
};

// === PROGRESS BAR ===
const CustomProgressBar = ({ status }: { status: string }) => {
  const steps = [
    { key: "PENDING", label: "Đặt hàng", icon: <FileTextOutlined /> },
    { key: "PROCESSING", label: "Xử lý", icon: <InboxOutlined /> },
    { key: "SHIPPING", label: "Vận chuyển", icon: <CarOutlined /> },
    { key: "DELIVERED", label: "Hoàn tất", icon: <CheckCircleOutlined /> },
  ];

  const currentIndex = steps.findIndex(s => s.key === status);
  const progress = currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="w-full px-4">
      <div className="relative flex justify-between items-center">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-600 -translate-y-1/2 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        ></div>

        {steps.map((step, idx) => {
          const completed = idx <= currentIndex && currentIndex >= 0;
          return (
            <div key={idx} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500
                  ${completed ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-400"}
                  ${idx === currentIndex ? "ring-4 ring-green-100 scale-110" : ""}
                `}
              >
                <span className="text-lg">{step.icon}</span>
              </div>
              <span className={`text-xs mt-2 font-medium ${completed ? "text-green-700" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// === MODAL CHI TIẾT ===
const OrderDetailModal = ({ order, onClose }: { order: IOrder | null; onClose: () => void }) => {
  if (!order) return null;

  const total = calculateOrderTotal(order.orderDetails || []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h3>
            <Text type="secondary" className="text-sm">Mã đơn: DH{String(order.id).padStart(6, "0")}</Text>
          </div>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </div>

        <div className="p-6 space-y-6">
          {order.orderDetails?.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <img
                src={item.productImage.startsWith("http") ? item.productImage : `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${item.productImage}`}
                alt={item.productName}
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">{item.productName}</h4>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-sm font-medium bg-gray-200 px-3 py-1 rounded-full">
                    Số lượng: {item.quantity}
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Tổng thanh toán</span>
            <span className="text-3xl font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// === MAIN PAGE ===
const OrderTrackingPage = () => {
  const { user } = useCurrentApp();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await getOrderByUserId(user.id);
      console.log(res)
      setOrders(res.data?.data || []);
    } catch (error) {
      message.error("Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = useMemo(
    () => orders.filter(o => ["PENDING", "PROCESSING", "SHIPPING"].includes(o.statusOrder)),
    [orders]
  );

  const historyOrders = useMemo(
    () => orders.filter(o => ["DELIVERED", "CANCELLED"].includes(o.statusOrder)),
    [orders]
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-xl">Vui lòng đăng nhập để xem đơn hàng</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingCartOutlined className="text-green-600 text-4xl" />
            Đơn hàng của tôi
          </h1>
          <Link to="/" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2">
            Tiếp tục mua sắm <RightOutlined />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-gray-200">
            <InboxOutlined className="text-6xl text-gray-300 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-8">Hãy mua sắm ngay hôm nay!</p>
            <Link to="/">
              <Button type="primary" size="large" className="h-12 px-8 text-lg font-semibold">
                Bắt đầu mua sắm
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* ĐƠN HÀNG ĐANG XỬ LÝ */}
            {activeOrders.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-green-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Đơn hàng đang thực hiện</h2>
                </div>
                <div className="space-y-6">
                  {activeOrders.map(order => {
                    const total = calculateOrderTotal(order.orderDetails || []);
                    return (
                      <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <Text strong className="text-xl text-blue-700">
                              DH{String(order.id).padStart(6, "0")}
                            </Text>
                            <Text type="secondary" className="text-sm flex items-center gap-2">
                              <ClockCircleOutlined /> {formatDate(order.orderAt)}
                            </Text>
                          </div>
                          <Tag className={`text-base px-5 py-2 font-bold rounded-full ${getStatusStyles(order.statusOrder)}`}>
                            {getStatusLabel(order.statusOrder)}
                          </Tag>
                        </div>

                        <div className="p-6">
                          <div className="mb-8">
                            <CustomProgressBar status={order.statusOrder} />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {order.orderDetails?.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="text-center">
                                <img
                                  src={item.productImage.startsWith("http") ? item.productImage : `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${item.productImage}`}
                                  alt={item.productName}
                                  className="w-20 h-20 object-cover rounded-xl mx-auto mb-2 border-2 border-gray-100 shadow"
                                />
                                <p className="text-xs text-gray-600 line-clamp-2">{item.productName}</p>
                                <p className="text-xs font-medium mt-1">x{item.quantity}</p>
                              </div>
                            ))}
                            {order.orderDetails && order.orderDetails.length > 4 && (
                              <div className="flex items-center justify-center text-gray-500 font-medium">
                                +{order.orderDetails.length - 4} món
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div>
                              <Text className="text-gray-600">Tổng thanh toán:</Text>
                              <Text strong className="text-2xl text-green-600 ml-3 font-bold">
                                {formatPrice(total)}
                              </Text>
                            </div>
                            <Space size="middle">
                              <Button size="large" icon={<EyeOutlined />} onClick={() => setSelectedOrder(order)}>
                                Xem chi tiết
                              </Button>
                              <Button type="primary" size="large" className="font-medium">
                                Theo dõi vận chuyển
                              </Button>
                            </Space>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* LỊCH SỬ ĐƠN HÀNG */}
            {historyOrders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-700">Lịch sử đơn hàng</h2>
                </div>
                <div className="space-y-5">
                  {historyOrders.map(order => {
                    const total = calculateOrderTotal(order.orderDetails || []);
                    const isCancelled = order.statusOrder === "CANCELLED";

                    return (
                      <div
                        key={order.id}
                        className={`bg-white rounded-2xl p-6 shadow-md border-l-8 transition-all hover:shadow-lg
                          ${isCancelled ? "border-l-gray-400" : "border-l-green-600"}
                        `}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${isCancelled ? "bg-gray-100" : "bg-green-100"}`}>
                              {isCancelled ? <CloseCircleOutlined className="text-2xl text-gray-500" /> : <CheckCircleOutlined className="text-2xl text-green-600" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Text strong className="text-xl">DH{String(order.id).padStart(6, "0")}</Text>
                                <Tag className={`px-4 py-1 text-sm font-medium rounded-full ${getStatusStyles(order.statusOrder)}`}>
                                  {getStatusLabel(order.statusOrder)}
                                </Tag>
                              </div>
                              <Text type="secondary" className="text-sm flex items-center gap-2">
                                <ClockCircleOutlined /> {formatDate(order.orderAt)}
                              </Text>
                              <p className="text-gray-700 mt-2">
                                {order.orderDetails?.[0]?.productName}
                                {order.orderDetails && order.orderDetails.length > 1 && (
                                  <span className="text-gray-500 italic"> +{order.orderDetails.length - 1} sản phẩm</span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                            <Text strong className="text-2xl text-green-600">
                              {formatPrice(total)}
                            </Text>
                            <Space>
                              <Button size="large" onClick={() => setSelectedOrder(order)}>
                                Xem chi tiết
                              </Button>
                              {!isCancelled && (
                                <Button type="primary" size="large">
                                  Mua lại
                                </Button>
                              )}
                            </Space>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default OrderTrackingPage;