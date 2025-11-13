import { ProTable } from "@ant-design/pro-components";
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
