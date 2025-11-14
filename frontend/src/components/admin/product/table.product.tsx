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
=======
import type { ProColumns } from "@ant-design/pro-components";

import { getProductsAPI } from "../../../service/api";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { Button, Image, Tag } from "antd"; 
import { useState } from "react"; 


// Định nghĩa các cột cho Product
const columns: ProColumns<IProductTable>[] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    hideInSearch: true,
    render(dom, entity) {
      return <a href="#">{entity.id}</a>;
    },
  },
  {
    title: "Hình ảnh",
    dataIndex: "image",
    key: "image",
    hideInSearch: true,
    render(dom, entity) {
      // Sử dụng component Image của Ant Design
      return <Image src={entity.image} width={60} preview={false} />;
    },
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Slug",
    dataIndex: "slug",
    key: "slug",
    hideInSearch: true,
    copyable: true,
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    hideInSearch: true,
    // Sử dụng valueType 'money' để tự động định dạng tiền tệ
    valueType: "money",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    hideInSearch: true,
  },
  {
    title: "Trạng thái",
    dataIndex: "active",
    key: "active",
    hideInSearch: true,
    render(dom, entity) {
      // Sử dụng Tag để hiển thị trạng thái
      return (
        <Tag color={entity.active ? "green" : "red"}>
          {entity.active ? "Active" : "Inactive"}
        </Tag>
      );
    },
  },
  {
    title: "Hành động",
    hideInSearch: true,
    // <<< SỬA 2: Thêm gạch dưới ( _ ) cho các biến không dùng
    // Khi bạn dùng (ví dụ: _entity), hãy xóa gạch dưới
    render(_dom, _entity, _index, _action, _schema) {
      return (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            // onClick={() => handleUpdate(_entity)}
          />
          <DeleteTwoTone
            twoToneColor="#ff4d4f"
            style={{ cursor: "pointer" }}
            // onClick={() => handleDelete(_entity.id)}
          />
        </>
      );
    },
  },
];

// Component Table cho Product
const ProductTable = () => {
  const [meta, setMeta] = useState({
    page: 1,
    size: 5,
    pages: 0,
    total: 0,
  });

  return (
    <ProTable<IProductTable>
      columns={columns}
      // <<< SỬA 3: Thêm gạch dưới ( _ ) cho các biến không dùng
      request={async (params, _sort, _filter) => {
        // !!! THAY ĐỔI: Gọi API để lấy dữ liệu sản phẩm
        const res = await getProductsAPI(
          params?.current ?? 1,
          params?.pageSize ?? 5
        );
        if (res.data) {
          setMeta(res.data.data.meta);
        }
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
        showTotal: (total, range) => {
          return (
            <div className="">
              {range[0]} - {range[1]} trên {total} rows
            </div>
          );
        },
      }}
      headerTitle="Table sản phẩm" // !!! THAY ĐỔI: Tiêu đề
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          // onClick={handleCreate}
          type="primary"
        >
          Thêm mới
        </Button>,
      ]}
    />
  );
};

export default ProductTable;

