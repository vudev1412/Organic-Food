// File path: /src/pages/account/order.tsx

import React, { useState, useMemo } from "react";
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
} from "@ant-design/icons";

// --- ENUM & TYPES ---
export enum StatusOrder {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
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
  // Đã xóa totalPrice, sẽ tính toán dynamic
}

// --- MOCK DATA ---
const mockOrders: IOrder[] = [
  {
    id: "ORD-001",
    status: StatusOrder.SHIPPING,
    date: "25/11/2025",
    items: [
      {
        id: 1,
        productName: "Rau cải thìa Organic (500g)",
        quantity: 2,
        price: 25000,
        image: "https://placehold.co/100x100?text=Rau",
      },
      {
        id: 2,
        productName: "Cà chua bi Đà Lạt (1kg)",
        quantity: 1,
        price: 400000,
        image: "https://placehold.co/100x100?text=Ca+Chua",
      },
    ],
  },
  {
    id: "ORD-002",
    status: StatusOrder.PENDING,
    date: "25/11/2025",
    items: [
      {
        id: 3,
        productName: "Nấm đùi gà (300g)",
        quantity: 3,
        price: 40000,
        image: "https://placehold.co/100x100?text=Nam",
      },
    ],
  },
  {
    id: "ORD-003",
    status: StatusOrder.DELIVERED,
    date: "20/11/2025",
    items: [
      {
        id: 4,
        productName: "Combo rau củ tuần",
        quantity: 1,
        price: 890000,
        image: "https://placehold.co/100x100?text=Combo",
      },
    ],
  },
  {
    id: "ORD-004",
    status: StatusOrder.CANCELLED,
    date: "18/11/2025",
    items: [
      {
        id: 5,
        productName: "Hành tây (1kg)",
        quantity: 1,
        price: 50000,
        image: "https://placehold.co/100x100?text=Hanh",
      },
    ],
  },
];

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const calculateOrderTotal = (items: IOrderItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const getStatusLabel = (status: StatusOrder) => {
  switch (status) {
    case StatusOrder.PENDING:
      return "Chờ xác nhận";
    case StatusOrder.PROCESSING:
      return "Đang xử lý";
    case StatusOrder.SHIPPING:
      return "Đang giao hàng";
    case StatusOrder.DELIVERED:
      return "Giao thành công";
    case StatusOrder.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
};

// Styles cho Badge trạng thái (Thay thế Tag AntD)
const getStatusStyles = (status: StatusOrder) => {
  switch (status) {
    case StatusOrder.PENDING:
      return "bg-orange-100 text-orange-600 border-orange-200";
    case StatusOrder.PROCESSING:
      return "bg-blue-100 text-blue-600 border-blue-200";
    case StatusOrder.SHIPPING:
      return "bg-indigo-100 text-indigo-600 border-indigo-200";
    case StatusOrder.DELIVERED:
      return "bg-green-100 text-green-600 border-green-200";
    case StatusOrder.CANCELLED:
      return "bg-red-100 text-red-600 border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

// --- CUSTOM COMPONENT: PROGRESS BAR ---
const CustomProgressBar = ({ status }: { status: StatusOrder }) => {
  const steps = [
    { key: StatusOrder.PENDING, label: "Đặt hàng", icon: <FileTextOutlined /> },
    { key: StatusOrder.PROCESSING, label: "Xử lý", icon: <InboxOutlined /> },
    { key: StatusOrder.SHIPPING, label: "Vận chuyển", icon: <CarOutlined /> },
    {
      key: StatusOrder.DELIVERED,
      label: "Giao hàng",
      icon: <CheckCircleOutlined />,
    },
  ];

  // Tìm index của bước hiện tại
  let currentStepIndex = steps.findIndex((s) => s.key === status);
  if (status === StatusOrder.CANCELLED) currentStepIndex = -1; // Hủy thì không hiện steps hoặc xử lý riêng

  return (
    <div className="w-full">
      <div className="relative flex justify-between items-center w-full">
        {/* Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full"></div>

        {/* Active Line (Màu xanh đè lên) */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-600 -z-0 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps Circles */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 bg-transparent z-10 relative"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                  ${isCurrent ? "ring-4 ring-green-100 scale-110" : ""}
                `}
              >
                <span className="text-xs sm:text-base">{step.icon}</span>
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium uppercase absolute -bottom-6 w-max
                  ${isCompleted ? "text-green-700" : "text-gray-400"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CUSTOM COMPONENT: MODAL DETAILS ---
const OrderDetailModal = ({
  order,
  onClose,
}: {
  order: IOrder | null;
  onClose: () => void;
}) => {
  if (!order) return null;

  const totalOrderPrice = calculateOrderTotal(order.items);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Chi tiết đơn hàng
            </h3>
            <span className="text-sm text-gray-500">Mã đơn: #{order.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border border-gray-100 rounded-lg p-3 hover:border-green-200 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-md border border-gray-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 line-clamp-1">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Đơn giá: {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      x{item.quantity}
                    </span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Tổng số lượng sản phẩm:</span>
            <span className="font-semibold text-gray-900">
              {order.items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-800">
              Tổng thanh toán:
            </span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(totalOrderPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const OrderTrackingPage = () => {
  const [orders] = useState<IOrder[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  // Phân loại đơn hàng
  const activeOrders = useMemo(
    () =>
      orders.filter((order) =>
        [
          StatusOrder.PENDING,
          StatusOrder.PROCESSING,
          StatusOrder.SHIPPING,
        ].includes(order.status)
      ),
    [orders]
  );

  const historyOrders = useMemo(
    () =>
      orders.filter((order) =>
        [StatusOrder.DELIVERED, StatusOrder.CANCELLED].includes(order.status)
      ),
    [orders]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileTextOutlined className="text-green-600" /> Quản lý đơn hàng
          </h1>
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 hover:underline"
          >
            Tiếp tục mua sắm <RightOutlined className="text-xs" />
          </Link>
        </div>

        {/* --- SECTION 1: ACTIVE ORDERS --- */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              Đơn hàng đang thực hiện
            </h2>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100">
              <InboxOutlined className="text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">Không có đơn hàng nào đang xử lý</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {activeOrders.map((order) => {
                const total = calculateOrderTotal(order.items);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-800">
                          #{order.id}
                        </span>
                        <span className="w-px h-4 bg-gray-300"></span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <ClockCircleOutlined /> {order.date}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Custom Steps */}
                      <div className="mb-10 px-2 mt-2">
                        <CustomProgressBar status={order.status} />
                      </div>

                      {/* Preview Items (Chỉ hiện 1-2 items đầu) */}
                      <div className="space-y-4">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 items-center"
                          >
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-700 text-sm line-clamp-1">
                                {item.productName}
                              </h4>
                              <div className="flex gap-4 mt-1 text-sm">
                                <span className="text-gray-500">
                                  x{item.quantity}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {formatCurrency(item.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-400 italic pl-1">
                            ...và còn {order.items.length - 2} sản phẩm khác
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer & Actions */}
                    <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-semibold">
                          Tổng thanh toán
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(total)}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <EyeOutlined /> Chi tiết
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 shadow-lg shadow-green-200 transition-all">
                          Theo dõi vận chuyển
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* --- SECTION 2: HISTORY ORDERS --- */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide">
              Lịch sử đơn hàng
            </h2>
          </div>

          {historyOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
              <p className="text-gray-500">Chưa có lịch sử đơn hàng</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {historyOrders.map((order) => {
                const total = calculateOrderTotal(order.items);
                const isCancelled = order.status === StatusOrder.CANCELLED;

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-lg p-5 border-l-[6px] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-shadow hover:shadow-md
                      ${isCancelled ? "border-l-red-500" : "border-l-green-600"}
                    `}
                  >
                    <div className="flex items-start gap-4 w-full sm:w-auto">
                      {/* Icon Circle */}
                      <div
                        className={`p-3 rounded-full shrink-0 ${
                          isCancelled
                            ? "bg-red-50 text-red-500"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {isCancelled ? (
                          <CloseCircleOutlined className="text-xl" />
                        ) : (
                          <CheckCircleOutlined className="text-xl" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">
                            #{order.id}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusStyles(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                          <ClockCircleOutlined /> {order.date}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-1">
                          {order.items[0].productName}
                          {order.items.length > 1 && (
                            <span className="text-gray-400 italic">
                              {" "}
                              +{order.items.length - 1} sp khác
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end w-full sm:w-auto justify-between sm:justify-center gap-2 pl-14 sm:pl-0">
                      <span className="font-bold text-gray-900 text-base">
                        {formatCurrency(total)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          Xem chi tiết
                        </button>
                        {!isCancelled && (
                          <button className="px-3 py-1.5 rounded border border-green-600 text-green-600 text-xs font-medium hover:bg-green-50 transition-colors">
                            Mua lại
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* --- RENDER MODAL --- */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderTrackingPage;
