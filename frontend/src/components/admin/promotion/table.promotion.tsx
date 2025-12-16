// /src/components/admin/promotion/table.promotion.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Space, Tooltip, Tag } from "antd";
import { deletePromotionAPI, getPromotionAPI } from "../../../service/api";
import DetailPromotion from "./detail.promotion";
import CreatePromotion from "./create.promotion";
import UpdatePromotion from "./update.promotion";


const TablePromotion = () => {
  const actionRef = useRef<ActionType>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<IPromotion | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IPromotion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { message, notification } = App.useApp();

  const refreshTable = () => actionRef.current?.reload();

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    const res = await deletePromotionAPI(id);

    if (res?.status === 204) {
      message.success("Xóa promotion thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Lỗi",
        description: res?.message ?? "Có lỗi xảy ra",
      });
    }
    setIsDeleting(false);
  };

  const columns: ProColumns<IPromotion>[] = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Tên", dataIndex: "name", copyable: true },
    {
      title: "Loại",
      dataIndex: "type",
      render: (_, e) =>
        e.type === "PERCENT" ? (
          <Tag color="green">%</Tag>
        ) : (
          <Tag color="blue">Giảm tiền</Tag>
        ),
    },
    { title: "Giá trị", dataIndex: "value" },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (_, e) =>
        e.active ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngưng</Tag>
        ),
    },
    {
      title: "Thao tác",
      hideInSearch: true,
      render(_, entity) {
        return (
          <Space>
            <Tooltip title="Chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => {
                  setDataDetail(entity);
                  setOpenDetail(true);
                }}
              />
            </Tooltip>

            <EditTwoTone
              onClick={() => {
                setDataUpdate(entity);
                setOpenUpdate(true);
              }}
            />

            <Popconfirm
              title="Xóa promotion?"
              onConfirm={() => handleDelete(entity.id)}
              okButtonProps={{ loading: isDeleting }}
            >
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<IPromotion>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        headerTitle="Quản lý Promotion"
        request={async (params) => {
          let query = `page=${params.current}&size=${params.pageSize}`;
          if (params.name) query += `&name=${params.name}`;

          const res = await getPromotionAPI(query);

          return {
            data: res.data?.data.result,
            success: true,
            total: res.data?.data.meta.total,
          };
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm mới
          </Button>,
        ]}
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

      <DetailPromotion
        open={openDetail}
        setOpen={setOpenDetail}
        data={dataDetail}
        setData={setDataDetail}
      />

      <CreatePromotion
        open={openCreate}
        setOpen={setOpenCreate}
        refreshTable={refreshTable}
      />

      <UpdatePromotion
        open={openUpdate}
        setOpen={setOpenUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TablePromotion;
