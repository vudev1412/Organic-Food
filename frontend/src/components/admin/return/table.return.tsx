// File path: /src/components/admin/return/table.return.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm } from "antd";
import { getReturnsAPI, deleteReturnAPI } from "../../../service/api";
import DetailReturn from "./detail.return";
import CreateReturn from "./create.return";
import UpdateReturn from "./update.return";

type TSearch = {
  keyword?: string;
};

const TableReturn = () => {
  const actionRef = useRef<ActionType>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<IReturn | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IReturn | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { message, notification } = App.useApp();

  const refreshTable = () => actionRef.current?.reload();

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    const res = await deleteReturnAPI(id);

    if (res?.status === 204) {
      message.success("Xóa return thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Lỗi",
        description: res?.message ?? "Có lỗi xảy ra",
      });
    }
    setIsDeleting(false);
  };
  const formatReturnId = (entity: IReturn) => {
    if (!entity?.id) return "Không có ID";

    const id = entity.id;

    if (id < 10) return `RT00${id}`;
    if (id < 100) return `RT0${id}`;
    if (id < 1000) return `RT${id}`;

    return `RT${id}`;
  };
  const formatORId = (orderId: number | undefined) => {
    if (!orderId) return "Không có ID";
    if (orderId < 10) return `HD00${orderId}`;
    if (orderId < 100) return `HD0${orderId}`;
    return `HD${orderId}`;
  };

  const columns: ProColumns<IReturn>[] = [
    {
      title: "Mã hoàn trả",
      dataIndex: "id",
      hideInSearch: true,
      render: (_, entity) => <a>{formatReturnId(entity)}</a>,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      hideInSearch: true,
      render: (_, entity) => <span>{formatORId(entity.orderId)}</span>,
    },
    { title: "Khách hàng", dataIndex: "customerName", hideInSearch: true },
    { title: "Lý do", dataIndex: "reason", hideInSearch: true },
    {
      title: "Tìm kiếm",
      dataIndex: "keyword",
      hideInTable: true,
      fieldProps: {
        placeholder: "Tìm theo mã đơn hàng hoặc tên khách hàng",
      },
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      hideInSearch: true,
      render: (_, entity) => {
        const mapStatus: Record<string, string> = {
          PENDING: "Đang chờ duyệt",
          APPROVED: "Đã duyệt",
          REJECTED: "Từ chối",
          CANCELED: "Đã hủy",
        };
        return <span>{mapStatus[entity.status] ?? entity.status}</span>;
      },
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "returnType",
      hideInSearch: true,
      render: (_, entity) => {
        const mapType: Record<string, string> = {
          REFUND: "Hoàn tiền",
          EXCHANGE: "Đổi sản phẩm",
        };
        return <span>{mapType[entity.returnType] ?? entity.returnType}</span>;
      },
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={(e) => {
              e.stopPropagation();
              setDataUpdate(entity);
              setOpenUpdate(true);
            }}
          />
          <Popconfirm
            title="Xóa Return"
            description="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(entity.id)}
            okButtonProps={{ loading: isDeleting }}
          >
            <DeleteTwoTone
              twoToneColor="#ff4d4f"
              style={{ cursor: "pointer" }}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <h2>Tìm kiếm</h2>
      <ProTable<IReturn, TSearch>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="Đổi trả"
        pagination={{ defaultPageSize: 5, showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm mới
          </Button>,
        ]}
        search={{
          labelWidth: "auto",
          defaultCollapsed: false,
          // Đã xóa optionRender: false để hiện nút tìm kiếm
        }}
        request={async (params) => {
          const queryParams = new URLSearchParams({
            page: params.current?.toString() || "1",
            size: params.pageSize?.toString() || "5",
          });

          if (params.keyword) {
            queryParams.append("keyword", params.keyword);
          }

          const res = await getReturnsAPI(queryParams.toString());

          return {
            data: res.data?.data.result || [],
            success: true,
            page: res.data?.data.meta.page,
            total: res.data?.data.meta.total,
          };
        }}
        onRow={(record) => ({
          onClick: () => {
            setDataDetail(record);
            setOpenDetail(true);
          },
        })}
      />

      <DetailReturn
        open={openDetail}
        setOpen={setOpenDetail}
        data={dataDetail}
        setData={setDataDetail}
      />

      <CreateReturn
        open={openCreate}
        setOpen={setOpenCreate}
        refreshTable={refreshTable}
      />

      <UpdateReturn
        open={openUpdate}
        setOpen={setOpenUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableReturn;
