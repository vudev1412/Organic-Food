// File path: /src/pages/account/order.tsx

import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  FileTextOutlined,
  RightOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Space, Typography, Button, message } from "antd";
import { useCurrentApp } from "../../components/context/app.context";
import {
  cancelCodOrderAPI,
  checkReturnByOrderIdAPI,
  getOrderByUserId,
} from "../../service/api";
import ReturnRequestModal from "../../components/section/reutrn/ReturnRequestModal";
import ConfirmModal from "../../components/common/ConfirmModal";
const { Text } = Typography;

// === ENUM & TYPES ===
export const StatusOrder = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;
export type StatusOrder = (typeof StatusOrder)[keyof typeof StatusOrder];
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Tách dấu
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng -
    .replace(/[^\w\-]+/g, "") // Xóa ký tự đặc biệt
    .replace(/\-\-+/g, "-") // Xóa dấu gạch ngang liên tiếp
    .replace(/^-+/, "") // Xóa gạch ngang đầu
    .replace(/-+$/, ""); // Xóa gạch ngang cuối
};
// === HELPER ===
const isWithinReturnPeriod = (order: IOrder): boolean => {
  if (order.statusOrder !== StatusOrder.DELIVERED || !order.actualDate) {
    return false; // Chỉ áp dụng cho đơn đã giao thành công và có ngày giao thực tế
  }

  const actualDate = new Date(order.actualDate);
  const today = new Date();

  // Kiểm tra tính hợp lệ của ngày tháng
  if (isNaN(actualDate.getTime())) {
    console.error(
      `Order DH${String(order.id).padStart(
        6,
        "0"
      )}: Invalid actualDate format! Value: ${order.actualDate}`
    );
    return false;
  }

  // Tính số ngày chênh lệch (đơn vị miligiây)
  const timeDifference = today.getTime() - actualDate.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24); // Chuyển sang ngày

  // Cho phép khiếu nại trong vòng 7 ngày
  return dayDifference >= 0 && dayDifference <= 7;
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

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
    CANCELLED: "bg-red-100 text-white-600 border-gray-300",
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

  const currentIndex = steps.findIndex((s) => s.key === status);
  const progress =
    currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;

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
                  ${
                    completed
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                  ${
                    idx === currentIndex
                      ? "ring-4 ring-green-100 scale-110"
                      : ""
                  }
                `}
              >
                <span className="text-lg">{step.icon}</span>
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  completed ? "text-green-700" : "text-gray-400"
                }`}
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

// === MAIN PAGE ===
const OrderTrackingPage = () => {
  const { user, showToast, addToCart, cartItems } = useCurrentApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [returnOrder, setReturnOrder] = useState<IOrder | null>(null);
  //  STATE CHO CONFIRM MODAL HỦY ĐƠN
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [isRepurchaseModalOpen, setIsRepurchaseModalOpen] = useState(false);
  const [pendingRepurchaseOrder, setPendingRepurchaseOrder] =
    useState<IOrder | null>(null);
  const [duplicateProductsName, setDuplicateProductsName] =
    useState<string>("");
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
      console.log(res);
      setOrders(res.data?.data || []);
    } catch (error) {
      message.error("Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = useMemo(
    () =>
      orders.filter((o) =>
        ["PENDING", "PROCESSING", "SHIPPING"].includes(o.statusOrder)
      ),
    [orders]
  );

  const historyOrders = useMemo(
    () =>
      orders.filter((o) => ["DELIVERED", "CANCELLED"].includes(o.statusOrder)),
    [orders]
  );

  const handleClickReturn = async (order: IOrder) => {
    try {
      const res = await checkReturnByOrderIdAPI(order.id);
      console.log(res.data.data.data.hasReturnRequest);
      if (res.data?.data.data.hasReturnRequest === true) {
        // Đã khiếu nại → show toast warning
        showToast("Bạn đã gửi yêu cầu đổi trả cho đơn hàng này rồi", "warning");
        return;
      }

      // Chưa khiếu nại → mở modal
      setReturnOrder(order);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Không thể kiểm tra trạng thái khiếu nại";
      showToast(msg, "error");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-xl">Vui lòng đăng nhập để xem đơn hàng</Text>
      </div>
    );
  }
  const openCancelModal = (orderId: number) => {
    setOrderToCancel(orderId);
    setIsCancelModalOpen(true);
  };
  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    setIsCancelModalOpen(false);

    try {
      const res = await cancelCodOrderAPI(orderToCancel);

      // 🟢 THÊM KIỂM TRA NÀY:
      // Chỉ khi status là 200 (OK) hoặc 204 (No Content) mới coi là thành công
      if (res && (res.status === 200 || res.status === 204)) {
        showToast("Đã hủy đơn hàng thành công!", "success");
        fetchOrders();
      } else {
        // Nếu status khác (ví dụ backend trả về 200 nhưng kèm error code, hoặc axios config lạ)
        // Ta tự ném lỗi xuống catch
        throw new Error(
          res?.data?.message || "Hủy đơn hàng chỉ áp dụng cho phương thức COD"
        );
      }
    } catch (error: any) {
      // Bây giờ lỗi 400 hoặc lỗi do ta tự throw ở trên sẽ nhảy vào đây
      console.log("Lỗi catch:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi hủy đơn hàng";
      showToast(msg, "error");
    } finally {
      setOrderToCancel(null);
    }
  };
  const handleRepurchase = (order: IOrder) => {
    if (!order.orderDetails || order.orderDetails.length === 0) return;

    // Tìm các sản phẩm bị trùng
    const duplicates = order.orderDetails.filter((item) =>
      cartItems.some((cartItem) => cartItem.id === item.productId)
    );

    if (duplicates.length > 0) {
      // Nếu có trùng, lưu thông tin và mở modal xác nhận
      const names = duplicates.map((d) => d.productName).join(", ");
      setDuplicateProductsName(names);
      setPendingRepurchaseOrder(order);
      setIsRepurchaseModalOpen(true);
    } else {
      // Nếu không trùng, thêm thẳng vào giỏ
      processAddRepurchase(order);
    }
  };
  const processAddRepurchase = async (order: IOrder) => {
    // Đóng modal nếu đang mở
    setIsRepurchaseModalOpen(false);
    setPendingRepurchaseOrder(null);


    for (const item of order.orderDetails ?? []) {
      const productPayload = {
        id: item.productId,
        name: item.productName,
        price: item.price,
        image: item.productImage,
        slug: generateSlug(item.productName),
        quantity: 100, // Bypass check tồn kho client
      };

      // Gọi hàm thêm vào giỏ
      // addToCart sẽ tự cộng dồn số lượng nếu sản phẩm đã tồn tại
      await addToCart(productPayload, item.quantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingCartOutlined className="text-green-600 text-4xl" />
            Đơn hàng của tôi
          </h1>
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
          >
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
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-8">Hãy mua sắm ngay hôm nay!</p>
            <Link to="/">
              <Button
                type="primary"
                size="large"
                className="h-12 px-8 text-lg font-semibold"
              >
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    Đơn hàng đang thực hiện
                  </h2>
                </div>
                <div className="space-y-6">
                  {activeOrders.map((order) => {
                    const canCancel =
                      order.statusOrder === "PENDING" ||
                      order.statusOrder === "PROCESSING";
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <Text strong className="text-xl text-blue-700">
                              DH{String(order.id).padStart(6, "0")}
                            </Text>
                            <Text
                              type="secondary"
                              className="text-sm flex items-center gap-2"
                            >
                              <ClockCircleOutlined />{" "}
                              {formatDate(order.orderAt)}
                            </Text>
                          </div>
                          <span
                            className={`text-base px-5 py-2 font-bold rounded-full ${getStatusStyles(
                              order.statusOrder
                            )}`}
                          >
                            {getStatusLabel(order.statusOrder)}
                          </span>
                        </div>

                        <div className="p-6">
                          <div className="mb-8">
                            <CustomProgressBar status={order.statusOrder} />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {order.orderDetails
                              ?.slice(0, 4)
                              .map((item, idx) => (
                                <div key={idx} className="text-center">
                                  <img
                                    src={
                                      item.productImage.startsWith("http")
                                        ? item.productImage
                                        : `${
                                            import.meta.env
                                              .VITE_BACKEND_PRODUCT_IMAGE_URL
                                          }${item.productImage}`
                                    }
                                    alt={item.productName}
                                    className="w-20 h-20 object-cover rounded-xl mx-auto mb-2 border-2 border-gray-100 shadow"
                                  />
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs font-medium mt-1">
                                    x{item.quantity}
                                  </p>
                                </div>
                              ))}
                            {order.orderDetails &&
                              order.orderDetails.length > 4 && (
                                <div className="flex items-center justify-center text-gray-500 font-medium">
                                  +{order.orderDetails.length - 4} món
                                </div>
                              )}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div></div>
                            <Space size="middle">
                              {canCancel && (
                                <Button
                                  danger
                                  size="large"
                                  className="font-medium border-red-500 text-red-500 hover:bg-red-50"
                                  onClick={() => openCancelModal(order.id)} // Gọi hàm mở modal
                                >
                                  Hủy đơn hàng
                                </Button>
                              )}
                              <Button
                                size="large"
                                icon={<EyeOutlined />}
                                onClick={() =>
                                  navigate(
                                    `/thanh-toan/thanh-cong?orderId=${order.id}`
                                  )
                                }
                              >
                                Xem chi tiết
                              </Button>
                              <Button
                                type="primary"
                                size="large"
                                className="font-medium"
                              >
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
                  <h2 className="text-2xl font-bold text-gray-700">
                    Lịch sử đơn hàng
                  </h2>
                </div>
                <div className="space-y-5">
                  {historyOrders.map((order) => {
                    const isCancelled =
                      order.statusOrder === StatusOrder.CANCELLED;
                    const canClaim = isWithinReturnPeriod(order);

                    return (
                      <div
                        key={order.id}
                        className={`bg-white rounded-2xl p-6 shadow-md border-l-8 transition-all hover:shadow-lg
                          ${
                            isCancelled
                              ? "border-l-gray-400"
                              : "border-l-green-600"
                          }
                        `}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-full ${
                                isCancelled ? "bg-gray-100" : "bg-green-100"
                              }`}
                            >
                              {isCancelled ? (
                                <CloseCircleOutlined className="text-2xl text-gray-500" />
                              ) : (
                                <CheckCircleOutlined className="text-2xl text-green-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Text strong className="text-xl">
                                  DH{String(order.id).padStart(6, "0")}
                                </Text>
                                <span
                                  className={`px-4 py-1 text-sm font-medium rounded-full ${getStatusStyles(
                                    order.statusOrder
                                  )}`}
                                >
                                  {getStatusLabel(order.statusOrder)}
                                </span>
                              </div>
                              <Text
                                type="secondary"
                                className="text-sm flex items-center gap-2"
                              >
                                <ClockCircleOutlined />{" "}
                                {formatDate(order.orderAt)}
                              </Text>
                              <p className="text-gray-700 mt-2">
                                {order.orderDetails?.[0]?.productName}
                                {order.orderDetails &&
                                  order.orderDetails.length > 1 && (
                                    <span className="text-gray-500 italic">
                                      {" "}
                                      +{order.orderDetails.length - 1} sản phẩm
                                    </span>
                                  )}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                            <Text
                              strong
                              className="text-2xl text-green-600"
                            ></Text>
                            <Space>
                              {canClaim && (
                                <Button
                                  size="large"
                                  danger
                                  className="font-medium"
                                  onClick={() => handleClickReturn(order)}
                                >
                                  Khiếu nại/Đổi trả
                                </Button>
                              )}
                              <Button
                                size="large"
                                onClick={() =>
                                  navigate(
                                    `/thanh-toan/thanh-cong?orderId=${order.id}`
                                  )
                                }
                              >
                                Xem chi tiết
                              </Button>
                              {!isCancelled && (
                                <Button
                                  type="primary"
                                  size="large"
                                  onClick={() => handleRepurchase(order)}
                                >
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

      {returnOrder && (
        <ReturnRequestModal
          order={returnOrder}
          visible={!!returnOrder}
          onClose={() => setReturnOrder(null)}
          onSuccess={fetchOrders} // reload danh sách đơn hàng sau khi tạo return
        />
      )}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này sẽ hủy đơn hàng ngay lập tức và không thể hoàn tác."
        confirmText="Hủy đơn hàng"
        cancelText="Quay lại"
      />
      {/* Modal xác nhận Mua lại (Khi trùng sản phẩm) */}
      <ConfirmModal
        isOpen={isRepurchaseModalOpen}
        onClose={() => setIsRepurchaseModalOpen(false)}
        onConfirm={() =>
          pendingRepurchaseOrder && processAddRepurchase(pendingRepurchaseOrder)
        }
        title="Sản phẩm đã có trong giỏ"
        message={`Các sản phẩm sau đã có trong giỏ hàng của bạn: ${duplicateProductsName}. Bạn có muốn tiếp tục thêm số lượng không?`}
        confirmText="Vẫn thêm"
        cancelText="Hủy bỏ"
      />
    </div>
  );
};

export default OrderTrackingPage;
