// File path: /src/components/admin/order/detail.order.tsx

import { Drawer, Descriptions, Table, Image, Tag, Space, Typography, Divider } from "antd";
import { IOrder } from "../../../service/api";

const { Text } = Typography;

// Cập nhật trạng thái mới + màu sắc chuẩn
const statusColors: Record<string, string> = {
  PENDING: "orange",
  PROCESSING: "cyan",
  SHIPPING: "purple",
  DELIVERED: "green",
  CANCELLED: "red",
};

const statusTexts: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

interface IProps {
  open: boolean;
  onClose: () => void;
  data: IOrder | null;
}

const DetailOrder = ({ open, onClose, data }: IProps) => {
  if (!data) return null;
    const formatOrderId = (id: number) => {
    if (id < 10) return `DH000${id}`;
    if (id < 100) return `DH00${id}`;
    if (id < 1000) return `DH0${id}`;
    return `DH${id}`;
  };
  const orderCode = formatOrderId(data.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // TỔNG TIỀN CHÍNH XÁC: Dùng item.price (backend đã tính sẵn thành tiền)
  const totalAmount = data.orderDetails?.reduce((sum, item) => sum + item.price, 0) || 0;

  const productColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "productImage",
      key: "image",
      width: 90,
      render: (image: string) => (
        <Image
          width={68}
          height={68}
          src={
            image?.startsWith("http")
              ? image
              : `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${image}`
          }
          style={{ objectFit: "cover", borderRadius: 10 }}
          preview={true}
          fallback="/default-product.png"
          className="border-2 border-white shadow-sm"
        />
      ),
    },
    {
      title: "Sản phẩm",
      key: "name",
      render: (_: any, record: any) => {
        const actualPrice = record.price / record.quantity;
        const hasDiscount = actualPrice < record.productPrice;

        return (
          <div className="py-2">
            <Text strong className="block text-base text-gray-800">
              {record.productName}
            </Text>
            <Space size={12} className="mt-2 text-sm">
              <Text type="secondary">
                SL: <strong className="text-gray-700">{record.quantity}</strong>
              </Text>
              <div>
                <Text type="secondary">Giá bán:</Text>{" "}
                <Text strong type="danger" className="text-base">
                  {formatPrice(actualPrice)}
                </Text>
                {hasDiscount && (
                  <del className="ml-2 text-gray-400 text-xs">
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
      width: 160,
      align: "right" as const,
      render: (_: any, record: any) => (
        <Text strong type="danger" className="text-lg font-bold">
          {formatPrice(record.price)}
        </Text>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <Space align="center">
          <Text strong className="text-2xl text-blue-600">
            Chi tiết đơn hàng
          </Text>
          <Tag color="blue" className="text-xl px-5 py-2 font-bold">
            {orderCode}
          </Tag>
        </Space>
      }
      width={1000}
      open={open}
      onClose={onClose}
      extra={
        <Tag
          color={statusColors[data.statusOrder] || "default"}
          className="text-lg px-6 py-3 font-bold rounded-full shadow-md"
        >
          {statusTexts[data.statusOrder] || data.statusOrder}
        </Tag>
      }
      className="ant-drawer-content"
    >
      {/* Header đẹp */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl mb-8 shadow-xl">
        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex justify-between items-center">
            <div>
              <Text className="text-xl font-medium opacity-90">Thời gian đặt hàng</Text>
              <Text strong className="block text-2xl mt-2">
                {formatDate(data.orderAt)}
              </Text>
            </div>
            <div className="text-right">
              <Text className="text-xl font-medium opacity-90">Tổng tiền đơn hàng</Text>
              <Text strong className="block text-4xl font-bold mt-2">
                {formatPrice(totalAmount)}
              </Text>
            </div>
          </div>
        </Space>
      </div>

      {/* Thông tin khách hàng & giao hàng */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-6 shadow-md">
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label={<Text strong className="text-gray-700">Khách hàng</Text>}>
            <Text strong>ID: {data.userId || "Khách lẻ"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong className="text-gray-700">Địa chỉ giao</Text>}>
            <Text className="text-gray-800">{data.shipAddress}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong className="text-gray-700">Ghi chú</Text>} span={2}>
            <Text italic type="secondary" className="text-gray-600">
              {data.note || "Không có ghi chú"}
            </Text>
          </Descriptions.Item>
          {data.estimatedDate && (
            <Descriptions.Item label={<Text strong className="text-gray-700">Dự kiến giao</Text>}>
              {formatDate(data.estimatedDate)}
            </Descriptions.Item>
          )}
          {data.actualDate && (
            <Descriptions.Item label={<Text strong className="text-green-600">Đã giao lúc</Text>}>
              <Text strong type="success" className="text-lg">
                {formatDate(data.actualDate)}
              </Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>

      <Divider>
        <Text strong className="text-xl text-gray-800">
          Danh sách sản phẩm ({data.orderDetails?.length || 0} món)
        </Text>
      </Divider>

      {/* Bảng sản phẩm */}
      <Table
        columns={productColumns}
        dataSource={data.orderDetails || []}
        rowKey={(record) => `${record.productId}-${record.id}`}
        pagination={false}
        size="large"
        bordered
        className="rounded-xl overflow-hidden shadow-lg"
        locale={{ emptyText: "Không có sản phẩm" }}
        summary={() => (
          <Table.Summary fixed="bottom">
            <Table.Summary.Row className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold">
              <Table.Summary.Cell index={0} colSpan={2}>
                <Text strong className="text-2xl">TỔNG CỘNG</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong className="text-3xl">
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