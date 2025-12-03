// File: src/components/admin/order/table.order.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  EyeOutlined,
  EditTwoTone,
  DeleteTwoTone,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { Button, Tag, Space, Typography, Tooltip, Popconfirm, App } from "antd";
import { getOrderAPI, getUserByIdAPI, deleteOrder } from "../../../service/api";
import DetailOrder from "./detail.order";
import CreateOrder from "./create.order";
import UpdateOrder from "./update.order";

const { Text } = Typography;

type TSearch = {
  id?: string;
  userName?: string;
  statusOrder?: string;
};

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

  const { message, notification } = App.useApp();

  const formatOrderId = (id?: number | null) => {
    if (id == null) return "-";
    return `DH${id.toString().padStart(6, "0")}`;
  };

  const parseOrderId = (code: string) => {
    if (!code) return NaN;
    if (code.startsWith("DH")) {
      return parseInt(code.slice(2), 10);
    }
    return parseInt(code, 10);
  };

  const formatPrice = (price: number) =>
    Number(price).toLocaleString("vi-VN") + " ₫";

  const columns: ProColumns<IOrder>[] = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      width: 120,
      fixed: "left",
      sorter: true,
      defaultSortOrder: "descend",
      render: (_, record) => <span>{formatOrderId(record.id)}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "userName",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.userName || "Khách lẻ"}</Text>
          {record.userName && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Mã KH: {record.userId}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Số lượng SP",
      width: 110,
      align: "center",
      hideInSearch: true,
      render: (_, record) => {
        const totalItems = record.orderDetails?.length || 0;
        return <Tag color="blue">{totalItems}</Tag>;
      },
    },
    {
      title: "Tổng tiền",
      width: 140,
      align: "right",
      hideInSearch: true,
      render: (_, record) => {
        const total =
          record.orderDetails?.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ) || 0;
        return (
          <Text strong type="danger" style={{ fontSize: 15 }}>
            {formatPrice(total)}
          </Text>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "statusOrder",
      width: 150,
      align: "center",
      valueType: "select",
      valueEnum: {
        PENDING: { text: "Chờ xác nhận", status: "Warning" },
        PROCESSING: { text: "Đang xử lý", status: "Processing" },
        SHIPPING: { text: "Đang giao", status: "Default" },
        DELIVERED: { text: "Đã giao", status: "Success" },
        CANCELLED: { text: "Đã hủy", status: "Error" },
      },
      render: (_, record) => (
        <Tag
          color={statusColors[record.statusOrder] || "default"}
          style={{
            width: 120,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 13,
            padding: "6px 0",
            borderRadius: 20,
            display: "inline-block",
          }}
        >
          {statusTexts[record.statusOrder] || record.statusOrder}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 130,
      fixed: "right",
      align: "center",
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#1890ff" }} />}
              onClick={() => {
                setDataViewDetail(record);
                setOpenViewDetail(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditTwoTone twoToneColor="#fa8c16" />}
              onClick={() => {
                setDataUpdate(record);
                setOpenUpdate(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa đơn hàng?"
            onConfirm={async () => {
              try {
                await deleteOrder(record.id);
                message.success("Xóa đơn hàng thành công!");
                actionRef.current?.reload();
              } catch (error: any) {
                notification.error({
                  message: "Xóa thất bại",
                  description: error.response?.data?.message || "Có lỗi xảy ra",
                });
              }
            }}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Tìm kiếm</h2>
      <ProTable<IOrder, TSearch>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        cardBordered
        scroll={{ x: 1200 }}
        headerTitle={
          <Space>
            <Text strong style={{ fontSize: 20 }}>
              Quản lý đơn hàng
            </Text>
          </Space>
        }
        toolBarRender={() => [
          <Button
            key="reload"
            icon={<ReloadOutlined />}
            onClick={() => actionRef.current?.reload()}
          >
            Làm mới
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setOpenCreate(true)}
          >
            Tạo đơn mới
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          let query = `page=${params.current || 1}&size=${params.pageSize || 10}`;

          // 1. Filter theo ID đơn hàng
          if (params.id) {
            const idNum = parseOrderId(params.id.toString());
            if (!isNaN(idNum)) query += `&filter=id=${idNum}`;
          }

          // 2. Filter theo tên khách hàng (nếu backend hỗ trợ)
          // Lưu ý: Cần backend hỗ trợ join với bảng user
          if (params.userName) {
            query += `&filter=user.name~'${params.userName}'`;
          }

          // 3. Filter theo trạng thái
          if (params.statusOrder) {
            query += `&filter=statusOrder='${params.statusOrder}'`;
          }

          // 4. Sort
          if (sort && Object.keys(sort).length > 0) {
            const sortField = Object.keys(sort)[0];
            const sortOrder =
              sort[Object.keys(sort)[0]] === "ascend" ? "ASC" : "DESC";
            query += `&sort=${sortField},${sortOrder}`;
          }

          try {
            const res = await getOrderAPI(query);
            const rawData = res.data?.data?.result || [];

            const enhanced = await Promise.all(
              rawData.map(async (order: any) => {
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
              data: enhanced,
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
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total, range) => (
            <span style={{ fontSize: 15, color: "#595959" }}>
              Hiển thị{" "}
              <strong>
                {range[0]}-{range[1]}
              </strong>{" "}
              trong <strong style={{ color: "#1677ff" }}>{total}</strong> đơn
              hàng
            </span>
          ),
        }}
      />

      <DetailOrder
        open={openViewDetail}
        onClose={() => setOpenViewDetail(false)}
        data={dataViewDetail}
      />

      <CreateOrder
        open={openCreate}
        setOpen={setOpenCreate}
        refreshTable={() => actionRef.current?.reload()}
      />

      <UpdateOrder
        open={openUpdate}
        setOpen={setOpenUpdate}
        data={dataUpdate}
        refreshTable={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default TableOrder