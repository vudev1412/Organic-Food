// File path: /src/components/admin/category/table.category.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
import { App, Button, Popconfirm } from "antd";
import {
  getCategoriesAPI,
  deleteCategoryAPI,
  getParentCategoriesAPI,
} from "../../../service/api";
import CreateCategory from "./create.category";
import UpdateCategory from "./update.category";

const TableCategory = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({ page: 1, size: 5, pages: 0, total: 0 });
  const [isDelete, setIsDelete] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ICategoryTable | null>(null);
  const [parentMap, setParentMap] = useState<Map<number, string>>(new Map());
  const { message, notification } = App.useApp();

  // Load danh sách parent categories một lần khi component mount
  useEffect(() => {
    fetchParentCategories();
  }, []);

  const formatCateId = (entity: ICategoryTable) => {
    if (!entity?.id) return "Không có ID";

    const id = entity.id;

    if (id < 10) return `CT00${id}`;
    if (id < 100) return `CT0${id}`;
    if (id < 1000) return `CT${id}`;

    return `CT${id}`;
  };
  const fetchParentCategories = async () => {
    try {
      const res = await getParentCategoriesAPI();
      if (res.data && res.data.data) {
        const map = new Map(res.data.data.map((c: any) => [c.id, c.name]));
        setParentMap(map);
      }
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDelete(true);
    try {
      const res = await deleteCategoryAPI(id);
      if (res.status === 200 || res.status === 204) {
        message.success("Xóa category thành công");
        // Reload lại danh sách parent sau khi xóa
        await fetchParentCategories();
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
    {
      title: "Mã",
      dataIndex: "id",
      hideInSearch: true,
      render: (_, entity) => <a>{formatCateId(entity)}</a>,
    },
    { title: "Tên", dataIndex: "name" },
    {
      title: "Danh mục cha",
      dataIndex: "parentCategory",
      hideInSearch: true,
      render: (_, record) => record.parentCategory?.name || "—",
    },
    {
      title: "Thao tác",
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
            title="Xác nhận xóa danh mục"
            onConfirm={() => handleDelete(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDelete }}
          >
            <DeleteTwoTone
              twoToneColor="#ff4d4f"
              style={{ cursor: "pointer" }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <h2>Tìm kiếm</h2>
      <ProTable<ICategory>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={async (params, sort) => {
          try {
            let query = `page=${params.current}&size=${params.pageSize}`;

            // Filter theo tên với format: filter=name~'value'
            if (params.name?.trim()) {
              query += `&filter=name~'${params.name.trim()}'`;
            }

            // Filter theo parent category (nếu cần)
            if (params.parentId) {
              const separator = query.includes("filter=") ? ";" : "&filter=";
              query += `${separator}parentCategoryId:'${params.parentId}'`;
            }

            // Xử lý sort
            if (!Object.keys(sort).length) {
              query += `&sort=id,ASC`;
            } else {
              const field = Object.keys(sort)[0];
              const order = sort[field] === "ascend" ? "ASC" : "DESC";
              query += `&sort=${field},${order}`;
            }

            const res = await getCategoriesAPI(query);
            const list = res.data.data.result;

            // Sử dụng parentMap đã load sẵn để gắn tên parent
            const enhanced = list.map((item: any) => ({
              ...item,
              parentCategory: item.parentCategoryId
                ? {
                    id: item.parentCategoryId,
                    name: parentMap.get(item.parentCategoryId) || "Unknown",
                  }
                : null,
            }));

            setMeta(res.data.data.meta);

            return {
              data: enhanced,
              success: true,
              total: res.data.data.meta.total,
            };
          } catch (error: any) {
            notification.error({
              message: "Lỗi tải dữ liệu",
              description: error.response?.data?.message || error.message,
            });
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="id"
        pagination={{
          current: meta.page,
          pageSize: meta.size,
          total: meta.total,
          showSizeChanger: true,
        }}
        headerTitle="Quản lý danh mục"
        search={{
          labelWidth: "auto",
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm mới
          </Button>,
        ]}
      />

      <CreateCategory
        openModelCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={() => {
          fetchParentCategories(); // Reload parent list
          actionRef.current?.reload();
        }}
      />

      <UpdateCategory
        openModelUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={() => {
          fetchParentCategories(); // Reload parent list
          actionRef.current?.reload();
        }}
      />
    </>
  );
};

export default TableCategory;
