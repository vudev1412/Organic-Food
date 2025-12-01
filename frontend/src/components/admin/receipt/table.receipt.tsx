import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  PrinterOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Tag, Typography } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import DetailReceipt from "./detail.receipt";
import CreateReceipt from "./create.receipt";
import UpdateReceipt from "./update.receipt";
import { deleteReceiptAPI, getReceiptsAPI } from "../../../service/api";

dayjs.extend(customParseFormat);

type TSearch = {
  deliverName?: string;
  supplierName?: string;
};

const { Text } = Typography;

const TableReceipt = () => {
  const actionRef = useRef<ActionType>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<ResReceiptDTO | null>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ResReceiptDTO | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const { message, notification } = App.useApp();

  const refreshTable = () => actionRef.current?.reload();

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await deleteReceiptAPI(id);
      if (res?.status === 204 || res?.status === 200) {
        message.success("Xóa phiếu nhập thành công!");
        refreshTable();
      }
    } catch (error: any) {
      notification.error({
        message: "Xóa thất bại",
        description: error?.response?.data?.error || "Có lỗi xảy ra khi xóa",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const formatReceiptId = (id: number) => {
    return `PN${id.toString().padStart(6, "0")}`;
  };

  const columns: ProColumns<ResReceiptDTO>[] = [
    {
      title: "Mã phiếu",
      dataIndex: "id",
      width: 90,
      align: "center",
      render: (id) => <Tag color="blue">{formatReceiptId(id)}</Tag>,
    },
    {
      title: "Người nhận hàng",
      dataIndex: "deliverName",
      ellipsis: true,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: ["supplier", "name"],
      render: (name) =>
        name ? <Text strong>{name}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      align: "right",
      width: 140,
      sorter: true,
      render: (value) =>
        value ? (
          <Text strong type="danger" style={{ fontSize: "15px" }}>
            {value.toLocaleString("vi-VN")} ₫
          </Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Ngày giao",
      dataIndex: "shipDate",
      width: 150,
      render: (value) => {
        if (!value) return <Text type="secondary">—</Text>;
        const date = dayjs(value);
        return date.isValid() ? (
          <div>
            <div>{date.format("DD/MM/YYYY")}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {date.format("HH:mm")}
            </Text>
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Người tạo",
      dataIndex: ["user", "name"],
      width: 130,
      render: (name) => name || <Text type="secondary">—</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 130,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined className="text-blue-600" />}
            title="Xem chi tiết"
            onClick={(e) => {
              setDataDetail(record);
              setOpenDetail(true);
              e.stopPropagation();
            }}
          />

          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-green-600" />}
            title="Chỉnh sửa"
            onClick={(e) => {
              setDataUpdate(record);
              setOpenUpdate(true);
              e.stopPropagation();
            }}
          />

          <Popconfirm
            title="Xóa phiếu nhập này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              title="Xóa"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <ProTable<ResReceiptDTO, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered={{ table: true }}
        request={async (params) => {
          const query = `page=${params.current}&size=${params.pageSize}`;
          const res = await getReceiptsAPI(query);

          return {
            data: res.data?.data?.result || [],
            success: true,
            total: res.data?.data?.meta?.total || 0,
            page: res.data?.data?.meta?.page || 1,
          };
        }}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong ${total} phiếu nhập`,
        }}
        search={{
          labelWidth: "auto",
          collapseRender: (collapsed) =>
            collapsed ? "Mở rộng tìm kiếm" : "Thu gọn",
          searchText: "Tìm kiếm",
          resetText: "Làm mới",
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <PrinterOutlined className="text-xl text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">
              Quản lý Phiếu Nhập Hàng
            </span>
            
          </div>
        }
        toolBarRender={() => [
          <Button
            key="export"
            icon={<FileExcelOutlined />}
            onClick={() =>
              notification.info({
                message: "Tính năng xuất Excel đang phát triển",
              })
            }
          >
            Xuất Excel
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="font-medium shadow-lg"
            onClick={() => setOpenCreate(true)}
          >
            Tạo phiếu nhập mới
          </Button>,
        ]}
        options={{
          reload: true,
          density: false,
          setting: true,
          fullScreen: true,
        }}
        scroll={{ x: 1200 }}
        rowClassName="cursor-pointer hover:bg-indigo-50 transition-colors"
        onRow={(record) => ({
          onClick: () => {
            setDataDetail(record);
            setOpenDetail(true);
          },
        })}
      />

      {/* Modals */}
      <DetailReceipt
        open={openDetail}
        setOpen={setOpenDetail}
        data={dataDetail}
        setData={setDataDetail}
      />

      <CreateReceipt
        open={openCreate}
        setOpen={setOpenCreate}
        refreshTable={refreshTable}
      />

      <UpdateReceipt
        open={openUpdate}
        setOpen={setOpenUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableReceipt;
