import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  deleteUserAPI,
  getCustomersAPI,
  getEmployeesAPI,

} from "../../../service/api";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm } from "antd";
import DetailEmployee from "./employee.detail";
import CreateEmployee from "./create.employee";
import UpdateEmployee from "./update.employee";

// Định nghĩa các cột

type TSearch = {
  name: string;
  email: string;
  phone: string;
};
// Component
const TableEmployee = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({
    page: 1,
    size: 5,
    pages: 0,
    total: 0,
  });
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IEmployee | null>(
    null
  );
  const [openModelCreate, setOpenModalCreate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IEmployee | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const handleDeleteUser = async (id: number) => {
    setIsDeleteUser(true);
    const res = await deleteUserAPI(id);
    if (res && res.data) {
      message.success("Xóa user thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
    setIsDeleteUser(false);
  };
  const columns: ProColumns<IEmployee>[] = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <a
            onClick={() => {
              setOpenViewDetail(true);
              setDataViewDetail(entity);
            }}
            href="#"
          >
            {entity.id}
          </a>
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "userName",
      key: "userName",
      sorter: true,
      renderText: (_, entity) => entity.user.name,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      copyable: true,
      renderText: (_, entity) => entity.user.email,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      renderText: (_, entity) => entity.user.phone,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Employee code",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "Ngày làm",
      dataIndex: "hireDate",
      key: "hireDate",
      render: (_, entity) => {
        const date = new Date(entity.hireDate);
        return date.toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Action",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 15 }}
              onClick={() => {
                setDataUpdate(entity);
                setOpenModalUpdate(true);
              }}
            />
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa user"
              description="Bạn có chắc muốn xóa user này?"
              onConfirm={() => handleDeleteUser(entity.id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDeleteUser }}
            >
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ cursor: "pointer" }}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };
  return (
    <>
      <ProTable<IEmployee, TSearch>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          console.log("Request called with sort:", sort);
          let query = `page=${params.current}&size=${params.pageSize}`;

          // ================== FILTER ==================
          if (params.name) query += `&filter=user.name~'${params.name}'`;
          if (params.email) query += `&filter=user.email~'${params.email}'`;
          if (params.phone) query += `&filter=user.phone~'${params.phone}'`;

          if (sort && Object.keys(sort).length > 0) {
            const sortField = Object.keys(sort)[0].replace(/,/g, ".");
            const sortOrder = sort[Object.keys(sort)[0]];

            if (sortOrder) {
              const order = sortOrder === "ascend" ? "ASC" : "DESC";
              query += `&sort=${sortField},${order}`;
            }
          }

          const res = await getEmployeesAPI(query);
          console.log(res);
          if (res.data) setMeta(res.data.data.meta);

          return {
            data: res.data?.data.result,
            success: true,
            total: res.data?.data.meta.total,
            page: res.data?.data.meta.page,
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
        headerTitle="Employee"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Thêm mới
          </Button>,
        ]}
      />

      <DetailEmployee
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <CreateEmployee
        openModelCreate={openModelCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateEmployee
        openModelUpdate={openModalUpdate}
        setOpenModelUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableEmployee;
