// File path: /src/components/admin/order/table.order.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { Button, Tag, Space, Typography, Avatar, Tooltip, Popconfirm, message } from "antd";
import { getOrderAPI, getUserByIdAPI, updateOrder, deleteOrder } from "../../../service/api";
import DetailOrder from "./detail.order";
import CreateOrder from "./create.order";
import UpdateOrder from "./update.order";

const { Text } = Typography;

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

const TableOrder = () => {
  const actionRef = useRef<ActionType>(null);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IOrder | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IOrder | null>(null);

  // Format mã đơn hàng: DH000001
  const formatOrderId = (id: number) => `DH${String(id).padStart(6, "0")}`;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const columns: ProColumns<IOrder>[] = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      width: 110,
      fixed: "left",
      sorter: true,
      defaultSortOrder: "descend",
      render: (_, record) => (
        <Text strong className="text-blue-600 font-bold text-lg">
          {formatOrderId(record.id)}
        </Text>
      ),
    },
    {
      title: "Khách hàng",
      width: 160,
      render: (_, record) => (
        <div>
          <Text strong className="block text-base text-gray-800">
            {record.userName || "Khách lẻ"}
          </Text>
          {record.userName && (
            <Text type="secondary" className="text-xs">
              ID: {record.userId}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      width: 340,
      render: (_, record) => {
        const details = record.orderDetails || [];
        if (!details.length) return <Text type="secondary">Không có sản phẩm</Text>;

        return (
          <Space direction="vertical" size={8} className="w-full">
            {details.slice(0, 3).map((item, index) => {
              const actualPrice = item.price / item.quantity;
              const hasDiscount = actualPrice < item.productPrice;

              return (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <Avatar
                    size={48}
                    shape="square"
                    src={
                      item.productImage?.startsWith("http")
                        ? item.productImage
                        : item.productImage
                        ? `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${item.productImage}`
                        : "/default-product.png"
                    }
                    className="border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <Text strong className="block text-sm text-gray-800 truncate">
                      {item.productName}
                    </Text>
                    <Space size={12} className="mt-1 text-xs">
                      <Text type="secondary">
                        SL: <strong className="text-gray-700">{item.quantity}</strong>
                      </Text>
                      <div className="flex items-center gap-2">
                        <Text type="secondary">Giá:</Text>
                        <Text strong type="danger">
                          {formatPrice(actualPrice)}
                        </Text>
                        {hasDiscount && (
                          <del className="text-gray-400">
                            {formatPrice(item.productPrice)}
                          </del>
                        )}
                      </div>
                    </Space>
                  </div>
                </div>
              );
            })}
            {details.length > 3 && (
              <Tag color="blue" className="text-xs font-medium">
                +{details.length - 3} sản phẩm khác
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Tổng tiền",
      width: 150,
      align: "right",
      render: (_, record) => {
        const total = record.orderDetails?.reduce((sum, item) => sum + item.price, 0) || 0;
        return (
          <Text strong type="danger" className="text-xl font-bold">
            {formatPrice(total)}
          </Text>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "statusOrder",
      width: 120,
      render: (_, record) => (
        <Tag
          color={statusColors[record.statusOrder] || "default"}
          className="px-4 py-2 text-sm font-medium rounded-full shadow-sm"
        >
          {statusTexts[record.statusOrder] || record.statusOrder}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined className="text-blue-600 text-xl" />}
              onClick={() => {
                setDataViewDetail(record);
                setOpenViewDetail(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Cập nhật đơn hàng">
            <Button
              type="text"
              icon={<EditOutlined className="text-green-600 text-xl" />}
              onClick={() => {
                setDataUpdate(record);
                setOpenUpdate(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xóa đơn hàng này?"
            description={
              <div>
                <p>Mã đơn: <strong>{formatOrderId(record.id)}</strong></p>
                <p>Khách hàng: <strong>{record.userName || "Khách lẻ"}</strong></p>
                <p className="text-red-600 font-medium">Hành động này không thể hoàn tác!</p>
              </div>
            }
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              try {
                await deleteOrder(record.id);
                message.success("Xóa đơn hàng thành công!");
                actionRef.current?.reload();
              } catch (error: any) {
                message.error(error.response?.data?.message || "Không thể xóa đơn hàng!");
              }
            }}
          >
            <Tooltip title="Xóa đơn hàng">
              <Button danger type="text" icon={<DeleteOutlined className="text-xl" />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<IOrder>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        cardBordered
        scroll={{ x: 1350 }}
        className="shadow-xl rounded-2xl overflow-hidden bg-white"
        headerTitle={
          <div className="flex items-center gap-4">
            <Text strong className="text-2xl text-gray-800">
              Quản lý đơn hàng
            </Text>
            <Tag color="blue" className="text-base px-5 py-2 font-semibold">
              Tổng: <strong>{actionRef.current?.pagination?.total ?? 0}</strong> đơn
            </Tag>
          </div>
        }
        toolbar={{
          actions: [
            <Button
              key="create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="font-semibold text-base px-8 h-12 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setOpenCreate(true)}
            >
              Tạo đơn hàng mới
            </Button>,
          ],
        }}
        request={async (params) => {
          const query = `page=${params.current || 1}&size=${params.pageSize || 5}`;
          try {
            const res = await getOrderAPI(query);
            const rawData = res.data?.data?.result || [];

            const enhancedData = await Promise.all(
              rawData.map(async (order: IOrder) => {
                let userName = "Khách lẻ";
                if (order.userId) {
                  try {
                    const userRes = await getUserByIdAPI(order.userId);
                    userName = userRes.data?.data?.name || "Không xác định";
                  } catch {}
                }
                return { ...order, userName };
              })
            );

            return {
              data: enhancedData,
              success: true,
              total: res.data?.data?.meta?.total || 0,
            };
          } catch {
            return { data: [], success: false, total: 0 };
          }
        }}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          showTotal: (total, range) => (
            <span className="text-base font-medium text-gray-600">
              Hiển thị {range[0]}-{range[1]} trong <strong className="text-blue-600">{total}</strong> đơn hàng
            </span>
          ),
        }}
      />

      <DetailOrder open={openViewDetail} onClose={() => setOpenViewDetail(false)} data={dataViewDetail} />
      <CreateOrder open={openCreate} setOpen={setOpenCreate} refreshTable={() => actionRef.current?.reload()} />
      <UpdateOrder open={openUpdate} setOpen={setOpenUpdate} data={dataUpdate} refreshTable={() => actionRef.current?.reload()} />
    </>
  );
};

export default TableOrder;