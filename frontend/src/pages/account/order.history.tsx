// File path: /src/pages/account/order-history.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  RightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Tag, Space, Typography, Button } from "antd";

const { Text } = Typography;

// === ENUM & TYPES ===
export enum StatusOrder {
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

interface IOrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface IOrder {
  id: string;
  status: StatusOrder;
  date: string;
  items: IOrderItem[];
}

// === MOCK DATA ===
const mockHistoryOrders: IOrder[] = [
  {
    id: "ORD-2025-001",
    status: StatusOrder.DELIVERED,
    date: "20/11/2025",
    items: [
      {
        id: 1,
        productName: "Combo rau củ hữu cơ tuần",
        quantity: 1,
        price: 890000,
        image: "https://placehold.co/100x100?text=Combo",
      },
      {
        id: 2,
        productName: "Trứng gà ta (10 quả)",
        quantity: 2,
        price: 45000,
        image: "https://placehold.co/100x100?text=Trung",
      },
    ],
  },
  {
    id: "ORD-2025-002",
    status: StatusOrder.CANCELLED,
    date: "18/11/2025",
    items: [
      {
        id: 3,
        productName: "Hành tây tím (1kg)",
        quantity: 1,
        price: 50000,
        image: "https://placehold.co/100x100?text=Hanh",
      },
    ],
  },
  {
    id: "ORD-2025-003",
    status: StatusOrder.DELIVERED,
    date: "15/11/2025",
    items: [
      {
        id: 4,
        productName: "Sữa tươi Vinamilk không đường (1L x 4)",
        quantity: 1,
        price: 120000,
        image: "https://placehold.co/100x100?text=Sua",
      },
    ],
  },
];

// === HELPER ===
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const calculateTotal = (items: IOrderItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const getStatusInfo = (status: StatusOrder) => {
  if (status === StatusOrder.DELIVERED) {
    return {
      label: "Giao thành công",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircleOutlined className="text-green-600" />,
    };
  }
  return {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <CloseCircleOutlined className="text-red-600" />,
  };
};

// === MODAL CHI TIẾT ===
const OrderDetailModal = ({ order, onClose }: { order: IOrder | null; onClose: () => void }) => {
  if (!order) return null;

  const total = calculateTotal(order.items);
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h3>
            <p className="text-sm text-gray-600 mt-1">Mã đơn: #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-base line-clamp-2">
                    {item.productName}
                  </h4>
                  <div className="flex justify-between items-end mt-3">
                    <span className="text-sm font-medium bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                      x{item.quantity}
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Tổng thanh toán</span>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// === MAIN PAGE ===
const OrderHistoryPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-green-600 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingCartOutlined className="text-green-600 text-4xl" />
            Lịch sử mua hàng
          </h1>
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-semibold text-lg flex items-center gap-2 hover:underline"
          >
            Tiếp tục mua sắm <RightOutlined className="text-sm" />
          </Link>
        </div>

        {/* Content */}
        {mockHistoryOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-gray-200">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCartOutlined className="text-5xl text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-6">
              Khi bạn đặt hàng, chúng sẽ xuất hiện ở đây
            </p>
            <Link to="/">
              <Button type="primary" size="large" className="font-semibold h-12 px-8">
                Bắt đầu mua sắm ngay
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockHistoryOrders.map((order) => {
              const total = calculateTotal(order.items);
              const statusInfo = getStatusInfo(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-md border-l-8 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                  style={{
                    borderLeftColor: order.status === StatusOrder.DELIVERED ? "#10b981" : "#ef4444",
                  }}
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        {statusInfo.icon && (
                          <div className="text-3xl">{statusInfo.icon}</div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">#{order.id}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <ClockCircleOutlined /> {order.date}
                          </p>
                        </div>
                      </div>

                      <Tag
                        color={order.status === StatusOrder.DELIVERED ? "green" : "red"}
                        className="text-base px-6 py-2 font-bold rounded-full shadow-sm"
                      >
                        {statusInfo.label}
                      </Tag>
                    </div>

                    {/* Sản phẩm preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="text-center">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100 mx-auto mb-2 shadow-sm"
                          />
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {item.productName}
                          </p>
                          <p className="text-xs font-medium text-gray-700 mt-1">
                            x{item.quantity}
                          </p>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex items-center justify-center text-gray-500 text-sm font-medium">
                          +{order.items.length - 4} món khác
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm text-gray-600">Tổng thanh toán:</span>
                        <span className="text-2xl font-bold text-green-600 ml-3">
                          {formatCurrency(total)}
                        </span>
                      </div>

                      <Space size="middle" className="mt-4 sm:mt-0">
                        <Button
                          size="large"
                          icon={<EyeOutlined />}
                          onClick={() => setSelectedOrder(order)}
                          className="font-medium"
                        >
                          Xem chi tiết
                        </Button>
                        {order.status === StatusOrder.DELIVERED && (
                          <Button type="primary" size="large" className="font-medium">
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
        )}
      </div>

      {/* Modal chi tiết */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrderHistoryPage;