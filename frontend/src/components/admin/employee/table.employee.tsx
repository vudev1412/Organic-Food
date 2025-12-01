// File path: /src/components/admin/employee/table.employee.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { deleteUserAPI, getEmployeesAPI } from "../../../service/api";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Tag } from "antd";
import DetailEmployee from "./employee.detail";
import CreateEmployee from "./create.employee";
import UpdateEmployee from "./update.employee";

type TSearch = {
  name?: string;
  email?: string;
  phone?: string;
};

const TableEmployee = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({ page: 1, size: 5, total: 0 });
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IEmployee | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IEmployee | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { message, notification } = App.useApp();

  const formatUserId = (id?: number | null) => {
    if (id == null) return "-";
    return `NV${id.toString().padStart(6, "0")}`;
  };

  // Xóa user
  const handleDeleteUser = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await deleteUserAPI(id);
      if (res?.data) {
        message.success("Xóa user thành công");
        actionRef.current?.reload();
      } else {
        throw new Error(res?.message || "Xóa thất bại");
      }
    } catch (err: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: err.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Cấu hình cột ProTable
  const columns: ProColumns<IEmployee>[] = [
    {
      title: "Mã",
      dataIndex: "id",
      hideInSearch: true,
      render: (_, entity) => <a>{formatUserId(entity.id)}</a>,
    },
    {
      title: "Tên",
      dataIndex: ["user", "name"],
      key: "name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      copyable: true,
    },
    {
      title: "Điện thoại",
      dataIndex: ["user", "phone"],
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      hideInSearch: true,
    },
    {
      title: "Ngày làm",
      dataIndex: "hireDate",
      hideInSearch: true,
      render: (_, record) =>
        record.hireDate
          ? new Date(record.hireDate).toLocaleDateString("vi-VN")
          : "-",
    },
    {
      title: "Hoạt động",
      dataIndex: ["user", "active"],
      key: "active",
      hideInSearch: true,
      render: (_, entity: IEmployee) => (
        <Tag color={entity.user.active ? "green" : "red"}>
          {entity.user.active ? "Đang hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, record) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              setDataUpdate(record);
              setOpenModalUpdate(true);
            }}
          />
          <Popconfirm
            title="Xác nhận xóa user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleting }}
          >
            {/* <DeleteTwoTone
              twoToneColor="#ff4d4f"
              style={{ cursor: "pointer" }}
              onClick={(e) => e.stopPropagation()}
            /> */}
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <h2>Tìm kiếm</h2>
      <ProTable<IEmployee, TSearch>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        rowKey="id"
        headerTitle="Quản lý nhân viên"
        search={{ labelWidth: "auto" }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm mới
          </Button>,
        ]}
        request={async (params, sort) => {
          let query = `page=${params.current}&size=${params.pageSize}`;
          if (params.name) query += `&filter=user.name~'${params.name}'`;
          if (params.email) query += `&filter=user.email~'${params.email}'`;
          if (params.phone) query += `&filter=user.phone~'${params.phone}'`;

          if (sort && Object.keys(sort).length > 0) {
            const sortField = Object.keys(sort)[0].replace(",", ".");
            const sortOrder =
              sort[Object.keys(sort)[0]] === "ascend" ? "ASC" : "DESC";
            query += `&sort=${sortField},${sortOrder}`;
          }

          const res = await getEmployeesAPI(query);
          if (res?.data?.data?.meta) setMeta(res.data.data.meta);

          return {
            data: res?.data?.data?.result || [],
            success: true,
            total: res?.data?.data?.meta?.total || 0,
          };
        }}
        pagination={{
          current: meta.page,
          pageSize: meta.size,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} trên ${total} hàng`,
        }}
        onRow={(record) => ({
          onClick: () => {
            setOpenViewDetail(true);
            setDataViewDetail(record);
          },
        })}
      />

      {/* Modals */}
      <DetailEmployee
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <CreateEmployee
        openModelCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={() => actionRef.current?.reload()}
      />
      <UpdateEmployee
        openModelUpdate={openModalUpdate}
        setOpenModelUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default TableEmployee;
