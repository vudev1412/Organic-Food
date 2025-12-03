// src/components/admin/certificate/table.certificate.tsx
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Space, Tooltip } from "antd";
import CreateCertificate from "./create.certificate";
import UpdateCertificate from "./update.certificate";
import DetailCertificate from "./detail.certificate";
import { deleteCertificateAPI, getCertificatesAPI } from "../../../service/api";

const TableCertificate = () => {
  const actionRef = useRef<ActionType>(null);
  const { message, notification } = App.useApp();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ICertificate | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<ICertificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshTable = () => actionRef.current?.reload();

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteCertificateAPI(id);
      message.success("Xóa certificate thành công");
      refreshTable();
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error?.message || "Xóa thất bại",
      });
    }
    setIsDeleting(false);
  };
  const formatCerId = (id: number) => {
    return `CC${id.toString().padStart(6, "0")}`;
  };
  const columns: ProColumns<ICertificate>[] = [
    {
      title: "Mã",
      dataIndex: "id",
      hideInSearch: true,
      render: (_, entity) => <a>{formatCerId(entity.id)}</a>,
    },
    { title: "Tên", dataIndex: "name", sorter: true, hideInSearch: true },
    {
      title: "Ảnh",
      dataIndex: "image",
      hideInSearch: true,
      render: (_, record) =>
        record.image ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_CERS_IMAGE_URL}${
              record.image
            }`}
            alt={record.name}
            style={{ width: 50 }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Thao tác",
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Space size="middle">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined style={{ color: "#1890ff" }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDetail(true);
                  setDataDetail(record);
                }}
              />
            </Tooltip>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 15 }}
              onClick={(e) => {
                setDataUpdate(record);
                setOpenUpdate(true);
                e.stopPropagation();
              }}
            />
            <Popconfirm
              title="Xóa certificate"
              description="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDelete(record.id)}
              okButtonProps={{ loading: isDeleting }}
            >
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ cursor: "pointer" }}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<ICertificate>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="Quản lý chứng chỉ"
        cardBordered
        request={async (params) => {
          const res = await getCertificatesAPI();
          return {
            data: res.data?.data || [],
            success: true,
            page: res.data?.data?.meta?.page,
            total: res.data?.data?.meta?.total,
          };
        }}
        pagination={{ defaultPageSize: 5 }}
        toolBarRender={() => [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm mới
          </Button>,
        ]}
      />

      <CreateCertificate
        open={openCreate}
        setOpen={setOpenCreate}
        refreshTable={refreshTable}
      />
      <UpdateCertificate
        open={openUpdate}
        setOpen={setOpenUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
      <DetailCertificate
        open={openDetail}
        setOpen={setOpenDetail}
        data={dataDetail}
        setData={setDataDetail}
      />
    </>
  );
};

export default TableCertificate;
