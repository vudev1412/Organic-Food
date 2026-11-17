// File path: /src/components/admin/product/table.product.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  EditTwoTone,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import {
  Button,
  Tag,
  Tooltip,
  Avatar,
  Space,
  Typography,
} from "antd";
import { getProductsAPI } from "../../../service/api";
import DetailProduct from "./detail.product";
import CreateProductCertificate from "./create.product";
import UpdateProduct from "./update.product";

const { Text } = Typography;

// 👇 Khai báo search type
type TSearch = {
  id: string;
  name?: string;
  unit: string;
  active?: boolean;
};

const TableProduct = () => {
  const actionRef = useRef<ActionType>(null);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IProduct | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModelUpdate, setOpenModelUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IProduct | null>(null);

  const formatProductId = (id: number) => {
    return `SP${id.toString().padStart(6, "0")}`;
  };

  const parseProductId = (code: string) => {
    if (!code.startsWith("SP")) return NaN;
    const numPart = code.slice(2);
    return parseInt(numPart, 10);
  };

  const columns: ProColumns<IProduct>[] = [
    {
      title: "Mã SP",
      dataIndex: "id",
      width: 90,
      fixed: "left",
      sorter: true,
      defaultSortOrder: "ascend",
      render: (_, record) => <a>{formatProductId(record.id)}</a>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      width: 260,
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
            style={{ backgroundColor: "#f0f2f5" }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.origin_address || "Chưa có xuất xứ"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      width: 90,
      render: (_, record) => record.unit || "Đơn vị",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 90,
      align: "right",
      render: (_, record) => (
        <Text strong>{Number(record.quantity).toLocaleString("vi-VN")}</Text>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      width: 120,
      align: "right",
      sorter: true,
      render: (price) => (
        <Text strong type="danger" style={{ fontSize: 15 }}>
          {Number(price).toLocaleString("vi-VN")} ₫
        </Text>
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
        <Tag color={record.active ? "green" : "red"}>
          {record.active ? "Đang bán" : "Tạm ngưng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 130,
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
                setDataUpdate(record);
                setOpenModelUpdate(true);
              }}
            /> 
          </Tooltip>
          {/* <Popconfirm
            title="Xác nhận xóa sản phẩm?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
            />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<IProduct, TSearch>
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

          const filters: string[] = [];

          // Tìm theo mã SP / ID
          if (params.id) {
            const idNum = parseProductId(params.id);
            if (!isNaN(idNum)) {
              filters.push(`id=${idNum}`);
            }
          }

          // Tên sản phẩm
          if (params.name) {
            filters.push(`name~'*${params.name}*'`);
          }
          if (params.unit) {
            filters.push(`name~'*${params.unit}*'`);
          }

          // Trạng thái
          if (filter.active?.length) {
            const status = filter.active[0] === "true" ? "true" : "false";
            filters.push(`active==${status}`);
          }

          // Nếu có filter -> nối bằng dấu ;
          if (filters.length > 0) {
            query += `&filter=${filters.join(";")}`;
          }

          // Sort
          if (sort && Object.keys(sort).length > 0) {
            const field = Object.keys(sort)[0];
            const order = sort[field] === "ascend" ? "ASC" : "DESC";
            query += `&sort=${field},${order}`;
          } else {
            query += "&sort=id,ASC";
          }

          const res = await getProductsAPI(query);

          const rawData = res.data?.data?.result || [];
          const mapProduct: Record<number, IProduct> = {};

          rawData.forEach((item) => {
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
            total: res.data?.data?.meta.total || 0,
          };
        }}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
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
