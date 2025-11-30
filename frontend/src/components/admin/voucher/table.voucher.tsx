// File: src/components/admin/voucher/table.voucher.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, Popconfirm, Tag, App } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import CreateVoucher from "./create.voucher";
import UpdateVoucher from "./update.voucher";
import { deleteVoucherAPI, getVouchersAPI } from "../../../service/api";
import VoucherDetail from "./delete.voucher";

type TSearch = {
  code?: string;
  description?: string;
  typeVoucher?: string;
  active?: boolean;
};

const TableVoucher = () => {
  const actionRef = useRef<ActionType>();
  const { message, notification } = App.useApp();

  // BỎ HOÀN TOÀN state meta thủ công → để ProTable tự quản lý
  // const [meta, setMeta] = useState({ page: 1, size: 8, total: 0 });

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [voucherId, setVoucherId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteVoucher = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await deleteVoucherAPI(id);
      if (res?.data) {
        message.success("Xóa voucher thành công");
        actionRef.current?.reload();
      }
    } catch (err: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: err.response?.data?.message || "Có lỗi khi xóa voucher",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ProColumns<IResVoucherDTO>[] = [
    // ... giữ nguyên hết các cột như cũ
    {
      title: "Mã",
      dataIndex: "code",
      width: 140,
      sorter: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Loại",
      dataIndex: "typeVoucher",
      width: 120,
      valueType: "select",
      valueEnum: {
        PERCENTAGE: { text: "Phần trăm" },
        FIXED_AMOUNT: { text: "Số tiền cố định" },
        FREE_SHIPPING: { text: "Miễn phí vận chuyển" },
      },
      render: (_, record) => {
        const colorMap: Record<string, string> = {
          PERCENTAGE: "blue",
          FIXED_AMOUNT: "green",
          FREE_SHIPPING: "orange",
        };
        return <Tag color={colorMap[record.typeVoucher] || "default"}>{record.typeVoucher === "PERCENTAGE" ? "Phần trăm" : record.typeVoucher === "FIXED_AMOUNT" ? "Số tiền" : "Miễn phí ship"}</Tag>;
      },
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      width: 120,
      hideInSearch: true,
      render: (v) => (v != null ? `${v.toLocaleString("vi-VN")} ₫` : "—"),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 100,
      hideInSearch: true,
    },
    {
      title: "Đã dùng",
      dataIndex: "usedCount",
      width: 100,
      hideInSearch: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      width: 120,
      valueType: "select",
      valueEnum: {
        true: { text: "Kích hoạt", status: "Success" },
        false: { text: "Tắt", status: "Error" },
      },
      render: (_, record) => (
        <Tag color={record.active ? "green" : "red"}>
          {record.active ? "Đang kích hoạt" : "Tắt"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      width: 180,
      fixed: "right",
      hideInSearch: true,
      render: (_, record) => (
        <>
          <EyeOutlined
            className="text-blue-600 text-lg mr-4 cursor-pointer hover:text-blue-800"
            onClick={() => {
              setVoucherId(record.id);
              setOpenDetail(true);
            }}
          />
          <EditTwoTone
            twoToneColor="#f57800"
            className="text-lg mr-4 cursor-pointer"
            onClick={() => {
              setVoucherId(record.id);
              setOpenUpdate(true);
            }}
          />
          <Popconfirm
            title="Xóa voucher?" onConfirm={() => handleDeleteVoucher(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ loading: isDeleting }}>
            <DeleteTwoTone twoToneColor="#ff4d4f" className="text-lg cursor-pointer" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IResVoucherDTO, TSearch>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        cardBordered
        scroll={{ x: 1300 }}
        headerTitle="Quản lý Voucher"
        search={{
          labelWidth: "auto",
          searchText: "Tìm kiếm",
          resetText: "Làm mới",
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm Voucher
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          // params.current bắt đầu từ 1 (UI), nhưng API dùng page từ 0
          const currentPage = (params.current || 1) - 1;
          const pageSize = params.pageSize || 10;

          let query = `page=${currentPage}&size=${pageSize}`;

          if (params.code) query += `&filter=code~'${params.code}'`;
          if (params.description) query += `&filter=description~'${params.description}'`;
          if (params.typeVoucher) query += `&filter=typeVoucher:'${params.typeVoucher}'`;
          if (params.active !== undefined && params.active !== null) {
            query += `&filter=active:${params.active}`;
          }

          // Sort
          if (sorter && Object.keys(sorter).length > 0) {
            const field = Object.keys(sorter)[0];
            const order = sorter[field] === "ascend" ? "ASC" : "DESC";
            query += `&sort=${field},${order}`;
          }

          try {
            const res = await getVouchersAPI(query);

            const result = res.data?.data?.result || [];
            const total = res.data?.data?.meta?.total || 0;

            return {
              data: result,
              total,
              success: true,
            };
          } catch (error) {
            notification.error({
              message: "Lỗi tải dữ liệu",
              description: "Không thể lấy danh sách voucher",
            });
            return { data: [], total: 0, success: false };
          }
        }}
        // BỎ meta thủ công → để ProTable tự quản lý phân trang
        pagination={{
            defaultPageSize:5,
          showSizeChanger: true,
          pageSizeOptions: [ "10", "20", "50","100"],
          showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} voucher`,
        }}
      />

      <CreateVoucher
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          actionRef.current?.reload();
        }}
      />

      <UpdateVoucher
        open={openUpdate}
        voucherId={voucherId}
        onClose={() => {
          setOpenUpdate(false);
          setVoucherId(null);
          actionRef.current?.reload();
        }}
      />

      <VoucherDetail
        open={openDetail}
        voucherId={voucherId}
        onClose={() => {
          setOpenDetail(false);
          setVoucherId(null);
        }}
      />
    </>
  );
};

export default TableVoucher;