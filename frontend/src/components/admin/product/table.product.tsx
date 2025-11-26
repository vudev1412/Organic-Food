// File path: /src/components/admin/product/table.product.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import {
  App,
  Button,
  Tag,
  Tooltip,
  Avatar,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import { getProductsAPI, deleteProductAPI } from "../../../service/api";
import DetailProduct from "./detail.product";
import CreateProductCertificate from "./create.product";
import UpdateProduct from "./update.product";

const { Text } = Typography;

const TableProduct = () => {
  const actionRef = useRef<ActionType>(null);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IProduct | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const { message, notification } = App.useApp();
  const [openModelUpdate, setOpenModelUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const formatProductId = (id: number) => {
    if (id < 10) return `SP000${id}`;
    if (id < 100) return `SP00${id}`;
    if (id < 1000) return `SP0${id}`;
    return `SP${id}`;
  };

  const handleDelete = async (productId: number) => {
    try {
      const res: any = await deleteProductAPI(productId);
      if (res.status === 200 || res.status === 204) {
        message.success("Xóa sản phẩm thành công!");
        actionRef.current?.reload();
      }
    } catch (error: any) {
      notification.error({
        message: "Xóa thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra",
      });
    }
  };

  const columns: ProColumns<IProduct>[] = [
    {
      title: "Mã SP",
      dataIndex: "id",
      width: 100,
      fixed: "left",
      sorter: true,
      defaultSortOrder: "ascend",
      render: (_, record) => <a>{formatProductId(record.id)}</a>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      width: 280,
      render: (_, record) => (
        <Space>
          <Avatar
            size={44}
            shape="square"
            src={
              record.image
                ? `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${
                    record.image
                  }`
                : undefined
            }
            icon={<SafetyCertificateOutlined />}
            style={{ backgroundColor: "#f0f2f5", flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: 15 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.origin_address || "Chưa có xuất xứ"}
            </Text>
          </div>
        </Space>
      ),
    },

    {
      title: "Giá bán",
dataIndex: "price",
      width: 120,
      sorter: true,
      render: (price) => (
        <Text strong type="danger" style={{ fontSize: 15 }}>
          {Number(price).toLocaleString("vi-VN")} ₫
        </Text>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      width: 100,
      render: (_, enity) => (
        <Tag
          color={
            enity.quantity > 10
              ? "green"
              : enity.quantity > 0
              ? "orange"
              : "red"
          }
          style={{ fontWeight: 500 }}
        >
          {enity.quantity}{" "}
          {["", "Kg", "Gram", "Lít", "Hộp", "Cái"][enity.unit.id || 0] ||
            "Đơn vị"}
        </Tag>
      ),
    },
    {
      title: "Chứng nhận",
      dataIndex: "certificates",
      width: 220,
      render: (_, record) => {
        const certs = record.certificates || [];
        if (certs.length === 0) return <Tag color="default">Chưa có</Tag>;

        return (
          <Space size={[0, 4]} wrap>
            {certs.slice(0, 3).map((c) => (
              <Tooltip key={c.id} title={c.certNo ? `Số: ${c.certNo}` : c.name}>
                <Tag color="blue" style={{ margin: 2 }}>
                  <SafetyCertificateOutlined style={{ marginRight: 4 }} />
                  {c.name}
                </Tag>
              </Tooltip>
            ))}
            {certs.length > 3 && <Tag color="default">+{certs.length - 3}</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      width: 110,
      filters: true,
      onFilter: true,
      valueEnum: {
        true: { text: "Đang bán", status: "Success" },
        false: { text: "Tạm ngưng", status: "Error" },
      },
      render: (_, record) => (
        <Tag
          color={record.active ? "green" : "red"}
          style={{ fontWeight: 500 }}
        >
          {record.active ? "Đang bán" : "Tạm ngưng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 120,
      fixed: "right",
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
              onClick={(e) => {
                e.stopPropagation();
                setDataUpdate(record); // truyền toàn bộ record
                setOpenModelUpdate(true); // mở modal
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xóa sản phẩm?"
            description={`Xóa "${record.name}" vĩnh viễn?`}
onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type="text"
              icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<IProduct>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="id"
        scroll={{ x: 1300 }}
        headerTitle={
          <Space>
            <SafetyCertificateOutlined
              style={{ fontSize: 20, color: "#1890ff" }}
            />
            <Text strong style={{ fontSize: 20 }}>
              Quản lý sản phẩm
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
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm sản phẩm mới
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          let query = `page=${params.current}&size=${params.pageSize}`;

          if (params.name) query += `&filter=name~'*${params.name}*'`;
          if (filter.active?.length) {
            const status = filter.active[0] === "true" ? "true" : "false";
            query += `&filter=active==${status}`;
          }

          // Sort
          if (Object.keys(sort).length > 0) {
            const field = Object.keys(sort)[0];
            const order = sort[field] === "ascend" ? "ASC" : "DESC";
            query += `&sort=${field === "price" ? "price" : field},${order}`;
          } else {
            query += "&sort=id,ASC";
          }

          const res = await getProductsAPI(query);
          const rawData = res.data?.data.result || [];
          const mapProduct: Record<number, IProduct> = {};

          rawData.forEach((item: any) => {
            const id = item.id;
            if (!mapProduct[id]) {
              mapProduct[id] = {
                ...item,
                certificates: item.certificates || [],
              };
            } else {
              mapProduct[id].certificates = [
                ...(mapProduct[id].certificates || []),
                ...(item.certificates || []),
              ];
            }
          });

          return {
            data: Object.values(mapProduct),
            success: true,
            total: res.data?.data.meta.total || 0,
          };
        }}
        rowClassName={(record) => (!record.active ? "row-disabled" : "")}
        search={{
          labelWidth: "auto",
collapseRender: (collapsed) =>
            collapsed ? "Mở rộng tìm kiếm" : "Thu gọn",
        }}
        options={{ reload: false, density: false, setting: false }}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
      />

      <DetailProduct
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateProductCertificate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={() => actionRef.current?.reload()}
      />
      <UpdateProduct
        openModelUpdate={openModelUpdate}
        setOpenModelUpdate={setOpenModelUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default TableProduct;