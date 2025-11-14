import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Tag } from "antd";
import { deleteProductAPI, getProductsAPI } from "../../../service/api";
import DetailProduct from "./detail.product";
import UpdateProduct from "./update.product";
import CreateProduct from "./create.product"; // import component create

// Type filter/search
type TSearch = {
  name?: string;
  unit?: string;
  price?: number;
  quantity?: number;
};

// Interface sản phẩm
interface IProduct {
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  active: boolean; // Thêm trường active
}

const TableProduct = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({ page: 1, size: 5, pages: 0, total: 0 });
  const [isDeleteProduct, setIsDeleteProduct] = useState(false);

  // Modal & drawer state
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IProduct | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IProduct | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false); // state modal create

  const { message, notification } = App.useApp();

  // Xóa sản phẩm
  const handleDeleteProduct = async (id: number) => {
  setIsDeleteProduct(true);
  try {
    const res = await deleteProductAPI(id);
    // Nếu status 200 hoặc 204 => thành công
    if (res.status === 200 || res.status === 204) {
      message.success("Xóa sản phẩm thành công");
      actionRef.current?.reload();
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description: "Không thể xóa sản phẩm",
        duration: 5,
      });
    }
  } catch (error: any) {
    notification.error({
      message: "Xảy ra lỗi",
      description:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi xóa sản phẩm",
      duration: 5,
    });
  } finally {
    setIsDeleteProduct(false);
  }
};

  const columns: ProColumns<IProduct>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      hideInSearch: true,
      render: (_, entity) => (
        <a
          href="#"
          onClick={() => {
            setDataViewDetail(entity);
            setOpenViewDetail(true);
          }}
        >
          {entity.id}
        </a>
      ),
    },
    { title: "Name", dataIndex: "name", key: "name", sorter: true },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      hideInSearch: true,
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => {
              setDataUpdate(entity);
              setOpenModalUpdate(true);
            }}
          />
          <Popconfirm
            placement="leftTop"
            title="Xác nhận xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteProduct }}
          >
            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: "pointer" }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IProduct, TSearch>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={async (params, sort) => {
          let query = `page=${params.current}&size=${params.pageSize}`;
          if (params.name) query += `&filter=name ~ '${params.name}'`;
          if (params.unit) query += `&filter=unit ~ '${params.unit}'`;
          if (params.price) query += `&filter=price=${params.price}`;
          if (params.quantity) query += `&filter=quantity=${params.quantity}`;

          if (sort) {
            const sortField = Object.keys(sort)[0];
            const sortOrder = sort[sortField];
            if (sortOrder) {
              const order = sortOrder === "ascend" ? "ASC" : "DESC";
              query += `&sort=${sortField},${order}`;
            }
          }

          const res = await getProductsAPI(query);
          if (res.data) setMeta(res.data.data.meta);

          return {
            data: res.data?.data.result,
            success: true,
            page: res.data?.data.meta.page,
            total: res.data?.data.meta.total,
          };
        }}
        rowKey="id"
        pagination={{
          current: meta.page,
          pageSize: meta.size,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} trên ${total} rows`,
        }}
        headerTitle="Products"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)} // mở modal create
          >
            Thêm mới
          </Button>,
        ]}
      />

      {/* Drawer hiển thị chi tiết sản phẩm */}
      <DetailProduct
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      {/* Modal cập nhật sản phẩm */}
      <UpdateProduct
        openModelUpdate={openModalUpdate}
        setOpenModelUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={() => actionRef.current?.reload()}
      />

      {/* Modal tạo mới sản phẩm */}
      <CreateProduct
        openModelCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default TableProduct;
