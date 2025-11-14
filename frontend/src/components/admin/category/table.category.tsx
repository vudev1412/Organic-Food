import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm } from "antd";
import { getCategoriesAPI, deleteCategoryAPI } from "../../../service/api";
import CreateCategory from "./create.category";
import UpdateCategory from "./update.category";

const TableCategory = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({ page: 1, size: 5, pages: 0, total: 0 });
  const [isDelete, setIsDelete] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ICategory | null>(null);
  const { message, notification } = App.useApp();

  const handleDelete = async (id: number) => {
    setIsDelete(true);
    try {
      const res = await deleteCategoryAPI(id);
      if (res.status === 200 || res.status === 204) {
        message.success("Xóa category thành công");
        actionRef.current?.reload();
      }
    } catch (error: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsDelete(false);
    }
  };

  const columns: ProColumns<ICategory>[] = [
    { title: "ID", dataIndex: "id", key: "id", hideInSearch: true },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Parent ID", dataIndex: "parent_category_id", key: "parent_category_id" },
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
            title="Xác nhận xóa category"
            onConfirm={() => handleDelete(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDelete }}
          >
            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: "pointer" }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<ICategory>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={async (params) => {
          const query = `page=${params.current}&size=${params.pageSize}`;
          const res = await getCategoriesAPI(query);
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
        }}
        headerTitle="Categories"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalCreate(true)}>
            Thêm mới
          </Button>,
        ]}
      />

      <CreateCategory
        openModelCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={() => actionRef.current?.reload()}
      />

      <UpdateCategory
        openModelUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default TableCategory;
