// src/components/admin/order/detail.order.tsx

import {
  Drawer,
  Descriptions,
  Table,
  Image,
  Tag,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getUserByIdAPI } from "../../../service/api";

const { Text } = Typography;

// Trạng thái
const statusInfo: Record<
  string,
  { color: string; text: string; icon: React.ReactNode }
> = {
  PENDING: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    text: "Chờ xác nhận",
    icon: <ClockCircleOutlined className="text-yellow-600" />,
  },
  PROCESSING: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    text: "Đang xử lý",
    icon: <ClockCircleOutlined className="text-blue-600" />,
  },
  SHIPPING: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    text: "Đang giao",
    icon: <CarOutlined className="text-indigo-600" />,
  },
  DELIVERED: {
    color: "bg-green-50 text-green-700 border-green-200",
    text: "Đã giao",
    icon: <CheckCircleOutlined className="text-green-600" />,
  },
  CANCELLED: {
    color: "bg-gray-100 text-gray-600 border-gray-300",
    text: "Đã hủy",
    icon: <CloseCircleOutlined className="text-gray-500" />,
  },
};

interface IProps {
  open: boolean;
  onClose: () => void;
  data: IOrder | null;
}

const DetailOrder = ({ open, onClose, data }: IProps) => {
  const [userDetail, setUserDetail] = useState<IResUserById | null>(null);

  useEffect(() => {
    if (data?.userId) {
      getUserByIdAPI(data.userId).then((res) => {
        if (res?.data?.data) setUserDetail(res.data.data);
      });
    } else {
      setUserDetail(null);
    }
  }, [data]);

  if (!data) return null;

  const formatOrderId = (id?: number | null) => {
    if (id == null) return "-";
    return `DH${id.toString().padStart(6, "0")}`;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalAmount =
    data.orderDetails?.reduce((sum, item) => sum + item.price, 0) || 0;
  const status = statusInfo[data.statusOrder] || statusInfo.PENDING;

  const productColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "productImage",
      key: "image",
      width: 100,
      render: (image: string) => (
        <Image
          width={80}
          height={80}
          src={
            image?.startsWith("http")
              ? image
              : `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${image}`
          }
          className="rounded-2xl object-cover border shadow-md"
          preview={true}
          fallback="/default-product.png"
        />
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      render: (_: any, record: any) => {
        const actualPrice = record.price / record.quantity;
        const hasDiscount = actualPrice < record.productPrice;

        return (
          <div className="py-3">
            <Text strong className="block text-lg text-gray-900 mb-2">
              {record.productName}
            </Text>
            <Space size={16} className="text-sm">
              <Text type="secondary">
                SL: <strong className="text-gray-700">{record.quantity}</strong>
              </Text>
              <div className="flex items-center gap-3">
                <Text type="secondary">Giá bán:</Text>
                <Text strong className="text-xl text-red-600">
                  {formatPrice(actualPrice)}
                </Text>
                {hasDiscount && (
                  <del className="text-gray-400 text-sm">
                    {formatPrice(record.productPrice)}
                  </del>
                )}
              </div>
            </Space>
          </div>
        );
      },
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 180,
      align: "right" as const,
      render: (_: any, record: any) => (
        <Text strong className="text-2xl font-bold text-red-600">
          {formatPrice(record.price)}
        </Text>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <Space align="center">
            <Text strong className="text-3xl text-blue-700">
              Chi tiết đơn hàng
            </Text>
            <Tag className="text-2xl px-6 py-2 font-bold rounded-full shadow-md bg-blue-100 text-blue-800">
              {formatOrderId(data.id)}
            </Tag>
          </Space>
        </div>
      }
      width={1100}
      open={open}
      onClose={onClose}
      closeIcon={null}
      bodyStyle={{ backgroundColor: "#fafafa", padding: "24px 32px" }}
      extra={
        <Tag
          className={`text-xl px-6 py-2 font-bold rounded-full shadow-md border ${status.color}`}
        >
          <Space size={12}>
            <span className="text-2xl">{status.icon}</span>
            {status.text}
          </Space>
        </Tag>
      }
    >
      {/* Header Gradient */}
      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white p-10 rounded-3xl mb-8 shadow-lg -mx-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Text className="text-xl opacity-90">Thời gian đặt hàng</Text>
            <Text strong className="block text-3xl mt-3 font-bold">
              {formatDate(data.orderAt)}
            </Text>
          </div>
          <div className="text-right">
            <Text className="text-xl opacity-90">Tổng tiền đơn hàng</Text>
            <Text strong className="block text-5xl mt-3 font-bold text-red-600">
              {formatPrice(totalAmount)}
            </Text>
          </div>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Thông tin giao hàng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
          <div className="space-y-6">
            <div>
              <Text type="secondary" className="text-base">
                Khách hàng
              </Text>
              {userDetail ? (
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <Text strong className="block text-xl text-gray-900">
                      {userDetail.name}
                    </Text>
                    <Text className="block text-lg text-gray-600">
                      {userDetail.phone}
                    </Text>
                    <Text className="block text-lg text-gray-600">
                      {userDetail.email}
                    </Text>
                  </div>
                </div>
              ) : (
                <Text strong className="block text-xl mt-1 text-gray-900">
                  Khách lẻ
                </Text>
              )}
            </div>

            <div>
              <Text type="secondary" className="text-base">
                Địa chỉ giao
              </Text>
              <Text className="block text-xl mt-1 text-gray-800 bg-gray-50 p-3 rounded-lg shadow-sm">
                {data.shipAddress}
              </Text>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Text type="secondary" className="text-base">
                Ghi chú
              </Text>
              <Text italic className="block text-xl mt-1 text-gray-600">
                {data.note || "Không có ghi chú"}
              </Text>
            </div>

            {data.estimatedDate && (
              <div>
                <Text type="secondary" className="text-base">
                  Dự kiến giao
                </Text>
                <Text strong className="block text-xl mt-1 text-blue-600">
                  {formatDate(data.estimatedDate)}
                </Text>
              </div>
            )}

            {data.actualDate && (
              <div>
                <Text type="secondary" className="text-base">
                  Đã giao lúc
                </Text>
                <Text
                  strong
                  className="block text-2xl mt-1 text-green-600 font-bold"
                >
                  {formatDate(data.actualDate)}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      <Divider>
        <Text strong className="text-2xl text-gray-800">
          Danh sách sản phẩm ({data.orderDetails?.length || 0} món)
        </Text>
      </Divider>

      <Table
        columns={productColumns}
        dataSource={data.orderDetails || []}
        rowKey={(record) => `${record.productId}-${record.id}`}
        pagination={false}
        size="large"
        className="rounded-2xl overflow-hidden shadow-lg"
        locale={{
          emptyText: (
            <div className="py-20 text-gray-400 text-center text-lg">
              Không có sản phẩm
            </div>
          ),
        }}
        summary={() => (
          <Table.Summary fixed="bottom">
            <Table.Summary.Row className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
              <Table.Summary.Cell index={0} colSpan={2}>
                <Text strong className="text-3xl font-bold">TỔNG CỘNG</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong className="text-4xl font-bold">
                  {formatPrice(totalAmount)}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Drawer>
  );
};

export default DetailOrder;
